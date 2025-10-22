/* MQTT Mutual Authentication Example

   This example code is in the Public Domain (or CC0 licensed, at your option.)

   Unless required by applicable law or agreed to in writing, this
   software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
   CONDITIONS OF ANY KIND, either express or implied.
*/
#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>
#include "esp_wifi.h"
#include "esp_system.h"
#include "nvs_flash.h"
#include "esp_event.h"
#include "esp_netif.h"
#include "protocol_examples_common.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "freertos/queue.h"

#include "lwip/sockets.h"
#include "lwip/dns.h"
#include "lwip/netdb.h"

#include "esp_log.h"
#include "mqtt_client.h"
#include "cJSON.h"

static const char *TAG = "MQTT_TASK";

static char *TOPIC_TO_PUBLISH_PATTERN = "backend/MISO/%s";
static char *TOPIC_TO_SUBSCRIBE_PATTERN = "backend/MOSI/%s";

static char *TOPIC_TO_PUBLISH [32];
static char *TOPIC_TO_SUBSCRIBE [32];

static char *DEVICEID = "ESP32";
static bool g_mqttChannelEnable = true;

extern const uint8_t client_cert_pem_start[] asm("_binary_client_crt_start");
extern const uint8_t client_cert_pem_end[] asm("_binary_client_crt_end");
extern const uint8_t client_key_pem_start[] asm("_binary_client_key_start");
extern const uint8_t client_key_pem_end[] asm("_binary_client_key_end");
extern const uint8_t server_cert_pem_start[] asm("_binary_mosquitto_org_crt_start");
extern const uint8_t server_cert_pem_end[] asm("_binary_mosquitto_org_crt_end");

static const esp_mqtt_client_config_t mqtt_cfg = {
    .uri = "mqtts://3.208.184.240:8883",
    .client_cert_pem = (const char *)client_cert_pem_start,
    .client_key_pem = (const char *)client_key_pem_start,
    .cert_pem = (const char *)server_cert_pem_start,
};
static esp_mqtt_client_handle_t client = NULL;

enum
{
    STATE_IDLE,
    STATE_CONNECTED,
    STATE_SUBSCRIBED,
    STATE_PUBLISH,
}g_sm_main;
enum
{
    CONNECTION_MESSAGE,
    DATA_MESSAGE
}g_sm_cmdid;

enum cmdid_offsets
{
    CMD_ID_OFFSET = 0,      // data[0]
    DEVICE_ID_OFFSET = 1,   // data[1] - data[11] (11 bytes)
    MAC_ADDR_OFFSET = 12,   // data[12] - data[29] (18 bytes)
    VOLTAGE_MV_OFFSET = 30  // data[30] - data[31] (2 bytes)
};

#define MAX_DEVICE_ID_LENGTH    11
#define MAX_MAC_ADDR_LENGTH     18
#define VOLTAGE_MV_LENGTH       2
#define CMD_ID_LENGTH           1

typedef struct 
{
     char cmdID;                          // 1
     char deviceID[MAX_DEVICE_ID_LENGTH]; // 32
     char mac_str[MAX_MAC_ADDR_LENGTH];   // 18
     struct 
    {
         uint16_t volatage_mV
    }data;
}__attribute__((packed)) message;

struct
{
    uint8_t data[CMD_ID_LENGTH + MAX_DEVICE_ID_LENGTH + MAX_MAC_ADDR_LENGTH + VOLTAGE_MV_LENGTH];

}__attribute__((packed)) data_message;


static void log_error_if_nonzero(const char *message, int error_code)
{
    if (error_code != 0) {
        ESP_LOGE(TAG, "Last error %s: 0x%x", message, error_code);
    }
}

/*
 * @brief Event handler registered to receive MQTT events
 *
 *  This function is called by the MQTT client event loop.
 *
 * @param handler_args user data registered to the event.
 * @param base Event base for the handler(always MQTT Base in this example).
 * @param event_id The id for the received event.
 * @param event_data The data for the event, esp_mqtt_event_handle_t.
 */
static void mqtt_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data)
{
    ESP_LOGD(TAG, "Event dispatched from event loop base=%s, event_id=%d", base, event_id);
    esp_mqtt_event_handle_t event = event_data;
    int msg_id;

    switch ((esp_mqtt_event_id_t)event_id) 
    {
        case MQTT_EVENT_CONNECTED:
            ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");            
            g_sm_main = MQTT_EVENT_CONNECTED;
            break;
        case MQTT_EVENT_DISCONNECTED:
            ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED");
            break;
        case MQTT_EVENT_SUBSCRIBED:
            ESP_LOGI(TAG, "MQTT_EVENT_SUBSCRIBED, msg_id=%d", event->msg_id);
            g_sm_main = STATE_SUBSCRIBED;
            break;
        case MQTT_EVENT_UNSUBSCRIBED:
            ESP_LOGI(TAG, "MQTT_EVENT_UNSUBSCRIBED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_PUBLISHED:
            ESP_LOGI(TAG, "MQTT_EVENT_PUBLISHED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_DATA:
            ESP_LOGI(TAG, "MQTT_EVENT_DATA");            
            printf("TOPIC=%.*s\r\n", event->topic_len, event->topic);
            printf("DATA=%.*s\r\n", event->data_len, event->data);

            cJSON *root = cJSON_Parse(event->data);

            if (root == NULL) {
                ESP_LOGE(TAG, "Error: Datos recibidos no son JSON válido.");
                return;
            }

            cJSON *mqttChannel = cJSON_GetObjectItem(root, "action");
            cJSON *enable = cJSON_GetObjectItem(root, "state");

            if (enable == NULL || mqttChannel == NULL) {
                ESP_LOGW(TAG, "JSON recibido no contiene 'action' o 'state'.");
                cJSON_Delete(root);
                return;
            }

            // 3. Comprobar que el comando sea el esperado (opcional pero recomendado)
            if (cJSON_IsString(mqttChannel) && (strcmp(mqttChannel->valuestring, "set_mqtt_channel_state") != 0)) {
                ESP_LOGW(TAG, "Comando de acción no reconocido: %s", mqttChannel->valuestring);
                cJSON_Delete(root);
                return;
            }

            g_mqttChannelEnable = (strcmp(enable->valuestring, "Habilitada") == 0) ? true : false;  
            
            cJSON_Delete(root);

            break;
        case MQTT_EVENT_ERROR:
            ESP_LOGI(TAG, "MQTT_EVENT_ERROR");
            if (event->error_handle->error_type == MQTT_ERROR_TYPE_TCP_TRANSPORT) {
                log_error_if_nonzero("reported from esp-tls", event->error_handle->esp_tls_last_esp_err);
                log_error_if_nonzero("reported from tls stack", event->error_handle->esp_tls_stack_err);
                log_error_if_nonzero("captured as transport's socket errno",  event->error_handle->esp_transport_sock_errno);
                ESP_LOGI(TAG, "Last errno string (%s)", strerror(event->error_handle->esp_transport_sock_errno));

            }
            break;
        default:
            ESP_LOGI(TAG, "Other event id:%d", event->event_id);
            break;
    }
}

static void mqtt_app_start(void)
{

    client = esp_mqtt_client_init(&mqtt_cfg);

    ESP_LOGI(TAG, "[APP] Free memory: %d bytes", esp_get_free_heap_size());

    /* The last argument may be used to pass data to the event handler, in this example mqtt_event_handler */
    esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqtt_event_handler, NULL);

    esp_mqtt_client_start(client);
}
// O rango completo 0-3300:
uint16_t generateVoltage_full() {
    return (uint16_t)(esp_random() % 4000);
}
void app_main(void)
{
    ESP_LOGI(TAG, "[APP] Startup..");
    ESP_LOGI(TAG, "[APP] Free memory: %d bytes", esp_get_free_heap_size());
    ESP_LOGI(TAG, "[APP] IDF version: %s", esp_get_idf_version());

    esp_log_level_set("*", ESP_LOG_INFO);
    esp_log_level_set("MQTT_CLIENT", ESP_LOG_VERBOSE);
    esp_log_level_set("TRANSPORT_BASE", ESP_LOG_VERBOSE);
    esp_log_level_set("TRANSPORT", ESP_LOG_VERBOSE);
    esp_log_level_set("OUTBOX", ESP_LOG_VERBOSE);

    ESP_ERROR_CHECK(nvs_flash_init());
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK(esp_event_loop_create_default());

    memset(data_message.data,'\0',sizeof(data_message.data));

    size_t len = strlen(DEVICEID);
    memcpy(&data_message.data[DEVICE_ID_OFFSET], DEVICEID, len);
    data_message.data[DEVICE_ID_OFFSET + len] = '\0';

    // snprintf((char*)&data_message.data[DEVICE_ID_OFFSET], 
    //      MAX_DEVICE_ID_LENGTH, 
    //      "%s", 
    //      DEVICEID);


    snprintf((char*)&data_message.data[MAC_ADDR_OFFSET], MAX_MAC_ADDR_LENGTH, 
         "%02x:%02x:%02x:%02x:%02x:%02x",0x25, 0x3A, 0x42, 0xCE, 0xB7, 0xFF);

    sprintf(TOPIC_TO_PUBLISH, TOPIC_TO_PUBLISH_PATTERN, DEVICEID);
    sprintf(TOPIC_TO_SUBSCRIBE, TOPIC_TO_SUBSCRIBE_PATTERN, DEVICEID);

    ESP_ERROR_CHECK(example_connect());

    mqtt_app_start();
    g_sm_main = STATE_IDLE;

    while(true)
    {
        switch (g_sm_main)
        {
            case STATE_IDLE:
                ESP_LOGI(TAG,"MAIN_STATE_IDLE...");
                vTaskDelay(3000 / portTICK_PERIOD_MS);                
                break;
            case MQTT_EVENT_CONNECTED:


                /* Send first uplink connection message */
                data_message.data[CMD_ID_OFFSET] = CONNECTION_MESSAGE; 
                
                // 💡 El casting es ahora correcto sin corrimiento
                message* pData = (message*) data_message.data;

                // 💡 Llenar el CMD_ID a través de la estructura para asegurar coherencia
                pData->cmdID = CONNECTION_MESSAGE; 
                
                // 💡 CORRECCIÓN DE LOGUEO: Acceder a 'volatage_mV' correctamente.
                // Aunque el voltaje no se usa en este mensaje, el logueo debe ser válido.
                ESP_LOGI(TAG,"MQTT Publish: DeviceID: %s, DeviceMACADDR: %s, Voltage_mV: %u (CMD %u)", 
                pData->deviceID, 
                pData->mac_str, 
                pData->data.volatage_mV, // ACCESO CORRECTO
                pData->cmdID             // Lectura del CMD_ID desde la estructura
                );

                int msg_id = esp_mqtt_client_publish(client,(const char*) TOPIC_TO_PUBLISH, (char*) data_message.data, sizeof(data_message.data), 1, 0);
                
                vTaskDelay(5000 / portTICK_PERIOD_MS);
                /* Send subscribe message */
                msg_id = esp_mqtt_client_subscribe(client, (const char*) TOPIC_TO_SUBSCRIBE, 0);
                ESP_LOGI(TAG, "Sent subscribe, msg_id=%d", msg_id);

                vTaskDelay(5000 / portTICK_PERIOD_MS);
                break;
            case STATE_SUBSCRIBED:
                
                if(g_mqttChannelEnable)
                {
                    data_message.data[CMD_ID_OFFSET] = DATA_MESSAGE;            
                    
                    // Obtener voltaje
                    uint16_t voltage_mv = generateVoltage_full();
                    
                    
                    // Mando formato little endian
                    data_message.data[VOLTAGE_MV_OFFSET] = voltage_mv & 0xff;
                    data_message.data[VOLTAGE_MV_OFFSET + 1] = (voltage_mv & 0xff00) >> 8;

                    msg_id = esp_mqtt_client_publish(client, (const char*) TOPIC_TO_PUBLISH, (char*) data_message.data, sizeof(data_message.data), 1, 0);
                    ESP_LOGI(TAG, "sent publish successful, msg_id=%d", msg_id);                
                    
                    message* p_Data = (message*) data_message.data;

                    ESP_LOGI(TAG,"MQTT Publish: DeviceID: %s, DeviceMACADDR: %s, Voltage_mV: %u", 
                    p_Data->deviceID, 
                    p_Data->mac_str, 
                    p_Data->data.volatage_mV
                    );
                }else{
                    ESP_LOGW(TAG,"MQTT Channel disabled...");
                }
                vTaskDelay(8000 / portTICK_PERIOD_MS);

                //g_sm_main = STATE_IDLE;                
                break;
            default:
                break;
        }
    }
}
