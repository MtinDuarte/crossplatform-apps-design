const mqtt = require('mqtt');
const fs = require('fs');
var pool = require('../mysql-connector').pool;


// --- CONFIGURACIÓN DE CONEXIÓN ---
const MQTT_BROKER_URL = 'mqtts://3.208.184.240:8883'; // Usamos 'mqtts' para TLS

// Rutas a los archivos de certificado en la EC2
const CA_CERT_PATH = '/src/backend/mqtt/ca.crt';
const CLIENT_CERT_PATH = '/src/backend/mqtt/backend.crt';
const CLIENT_KEY_PATH = '/src/backend/mqtt/backend.key';

const TOPIC_TO_PUBLISH = "backend/MOSI/";
const INGESTA_TOPIC = 'backend/MISO/#';                                                                                    

// --- OPCIONES DE CONEXIÓN ---
const options = {
    // Seguridad TLS
    protocol: 'mqtts',
    ca: fs.readFileSync(CA_CERT_PATH),
    key: fs.readFileSync(CLIENT_KEY_PATH),
    cert: fs.readFileSync(CLIENT_CERT_PATH),
    rejectUnauthorized : false,
    
    // Identificación
    //clientId: CLIENT_ID,
    clean: true, // Conexión limpia (no persistirá suscripciones tras desconexión)
    reconnectPeriod: 5000 // Intentar reconectar cada 5 segundos

};

var client = mqtt.connect(MQTT_BROKER_URL, options);
/**
* Payload MQTT de un dispositivo.
 *
 * Esquema de datos (total 22 bytes):
 * 1. CommandID (1 byte)
 * 2. DeviceID (11 bytes)
 * 3. MAC:ADDR (18 bytes)
 * 4. Data(Voltaje) [mV] (2 bytes little-endian)
 *
 * @param {Buffer} buffer El payload binario recibido del broker.
 * @returns {Object} Un objeto con los datos extraídos.
 */
function parsePayload(buffer) {
    if (!buffer || buffer.length < 32) { // Revisa que el buffer tenga la longitud mínima esperada
        console.error("Payload vacío o incompleto. Longitud:", buffer ? buffer.length : 0);
        return null;
    }

    let offset = 0;
    
    // 1. CommandID (1 byte)
    // Usamos readUInt8() para leer un byte sin signo
    const commandId = buffer.readUInt8(offset);
    offset += 1;

    // 2. DeviceID (11 bytes)
    // Leemos 11 bytes como cadena (asumiendo ASCII/UTF-8)
    const deviceId = buffer.toString('utf8', offset, offset + 11)        
        .replace(/\0/g, '')  // Elimina todos los \0
        .trim();             // Elimina espacios
    offset += 11;

    // 3. MAC:ADDR (18 bytes)
    // Leemos 18 bytes como cadena (asumiendo ASCII/UTF-8)
    const macAddress = buffer.toString('utf8', offset, offset + 18).trim();
    offset += 18;
    console.log("Mac addr %s",macAddress);

    // 4. Data(Voltaje) [mV] (2 bytes little-endian)
    // Usamos readUInt16LE() para leer 2 bytes (16 bits) como entero sin signo little-endian
    const voltageMv = buffer.readUInt16LE(offset); 
    offset += 2;

    // 5. Asignar el Timestamp desde el backend (CRÍTICO)
    const timestampUTC = new Date().toISOString(); 
    
    return {
        commandId: commandId,
        deviceId: deviceId,
        macAddress: macAddress,
        voltageMv: voltageMv,
        timestampUTC: timestampUTC
    };
}

function getDeviceById(deviceId, callback) 
{
    const sql = `SELECT * FROM Devices WHERE DeviceID = ?`;        

    pool.query(sql, [deviceId], function(err, rows) {
        if (err) {
            console.error(`Error al consultar dispositivo ${deviceId} en DB:`, err);
            return callback(err);
        }

        if (rows.length === 0) {
            console.log("Device not found: " + deviceId);
            return callback(null, null);
        }
        
        console.log("Cantidad de rows: " + rows.length);
        console.log("Device already registered: " + deviceId);
        
        callback(null, rows[0]);
    });
}
function insertDevice(deviceID, macAddress, callback)
{
    const sql = `INSERT INTO Devices (DeviceID, MAC_ADDRESS, DateTimeCreated) 
                 VALUES (?, ?, UTC_TIMESTAMP())`;

    pool.query(sql, [deviceID, macAddress], function(err, result) {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.warn(`[DB] Dispositivo ${deviceID} ya existe.`);
                return callback(new Error(`Device already exists: ${deviceID}`));
            }
            
            console.error("DB Error al insertar dispositivo:", err);
            return callback(err);
        }
        
        console.log(`[DB] Nuevo dispositivo insertado: ${deviceID}`);
        callback(null, result);
    });
}
function inserMeasurement(deviceID, voltage, callback)
{
    const sql = `INSERT INTO Measurements (DeviceID, Voltage, TimestampUTC) 
                 VALUES (?, ?, UTC_TIMESTAMP())`;

    pool.query(sql, [deviceID, voltage], function(err, result) {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.warn(`[DB] Dispositivo ${deviceID} ya existe.`);
                return callback(new Error(`Device already exists: ${deviceID}`));
            }
            
            console.error("DB Error al insertar dispositivo:", err);
            return callback(err);
        }
        
        console.log(`[DB] Nuevo dispositivo insertado: ${deviceID}`);
        callback(null, result);
    });
}
function toggleMQTTChannel(deviceID, enable, callback) {
    
    console.log("Dentro de toggleMQTTChannel");
    const cleanDeviceID = String(deviceID).replace(/\0/g, '').trim();
    const topic = TOPIC_TO_PUBLISH + cleanDeviceID;
    console.log("Topic final:", topic);
    // 1. Construir el Tópico completo
    //const topic = TOPIC_TO_PUBLISH + deviceID;
    
    console.log("Topic: " + topic);
    // 2. Definir el Payload (el mensaje a enviar)
    // Se recomienda usar un formato estructurado como JSON.
    const command = {
        action: 'set_mqtt_channel_state',
        state: enable // 'enable' o 'disable'
    };

    console.log("Command: " + command);

    // Convertir el objeto JSON a una cadena para la publicación
    const payload = JSON.stringify(command);
    //const payload = "test message";
    console.log("Payload: " + payload);

    // 3. Opciones de Publicación (Opcional, pero recomendado)
    const options = {
        qos: 0, // Quality of Service: 1 asegura la entrega al menos una vez.
        retain: false // No guardar el mensaje como el "último conocido" en el broker.
    };

    console.log("TOPIC_TO_PUBLISH:", JSON.stringify(TOPIC_TO_PUBLISH));
    console.log("deviceID:", JSON.stringify(deviceID));
    console.log("topic:", JSON.stringify(topic));

    // 4. Publicar el mensaje
    client.publish(topic, payload, options, (err) => {
        // La función de callback se llama cuando el publish es completado (o falla).
        if (err) {
            console.error(`Error publicando en ${topic}:`, err);
            return callback(err);
        }
        console.log(`Comando MQTT publicado en ${topic}. Payload: ${payload}`);
        callback(null); // Llamar a callback sin error indica éxito.
    });
}
// --- FUNCIÓN DE CONEXIÓN ---
function connectToBroker() {
    console.log(`Intentando conectar al broker en ${MQTT_BROKER_URL}...`);
    
    // Manejadores de Eventos
    client.on('connect', () => {
        console.log('✅ Conexión con Mosquitto exitosa!');
        
        // El backend debe suscribirse al tópico donde los dispositivos publican
         client.subscribe(INGESTA_TOPIC, (err) => {
             if (!err) {
                 console.log(`Subscrito al tópico de ingesta: ${INGESTA_TOPIC}`);
             }
         });         
    });

    client.on('message', async (topic, payload) => {
        // La lógica de persistencia a DynamoDB va aquí
        console.log(`Mensaje recibido en Tópico: ${topic}`);
        console.log(`Payload length ${payload.byteLength}`);
        
        if(payload.byteLength == 32)
        {
        // 1. Parsear el payload binario
            const data = parsePayload(payload); 

            if (data) 
            {
                
                data.deviceID = String(data.deviceID).replace(/\0/g, '').trim();
                
                if (data.commandId == 0)
                {
                    console.log(`Connection message ✅: ${topic}`);
                    console.log(`DeviceID: ${data.deviceId}, MAC: ${data.macAddress}`);                    
                    
                    getDeviceById(data.deviceId, function(err, device) 
                    {
                            if (err) 
                            {
                                console.error("Error:", err);
                                return;
                            }
                            
                            if (!device) {
                                console.log("No existe el dispositivo");

                                insertDevice(data.deviceId, data.macAddress, function(err, result) 
                                {
                                    if (err) {
                                        console.error("Error insertando:", err.message);
                                        return;
                                    }
                                    
                                    console.log("Insertado exitosamente:", result);
                                });
                                return;
                            }
                            
                            console.log("Dispositivo encontrado:", device);
                    });                    
                }
                else if (data.commandId == 1)
                {
                    console.log(`✅ Datos parseados de Tópico: ${topic}`);
                    console.log(`DeviceID: ${data.deviceId}, Voltaje: ${data.voltageMv} mV`);

                    getDeviceById(data.deviceId, function(err, device)
                    {
                            if (err) 
                            {
                                console.error("Error:", err);
                                return;
                            }
                            if (device) 
                            {                                
                                inserMeasurement(data.deviceId, data.voltageMv, function(err, result) 
                                {
                                    if (err) {
                                        console.error("Error insertando:", err.message);
                                        return;
                                    }
                                    
                                    console.log("Insertado exitosamente:", result);
                                });
                                return;
                            }                            
                    });                                    
                }

                
            } else {
                console.log(`❌ Mensaje descartado desde Tópico: ${topic}`);
            }
        }        
    });

    client.on('error', (error) => {
        console.error('❌ Error de conexión MQTT:', error);
    });

    client.on('close', () => {
        console.log('🔌 Conexión MQTT cerrada.');
    });

    return client;
}

module.exports = {connectToBroker, toggleMQTTChannel };


