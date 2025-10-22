import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { IMeasurements  } from '../../interfaces/IMeasurements';
import { MqttService } from 'src/app/services/mqtt.service';

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.page.html',
  styleUrls: ['./device-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardContent, RouterModule],
})
export class DeviceDetailPage implements OnInit {

  private route = inject(ActivatedRoute);
  private db = inject(DatabaseService);
  private IMqtt = inject(MqttService);

  DeviceID!: string;
  lastMeasurement?: number;
  lastReport?: IMeasurements;
  mqttChannel: string;

  constructor() 
  {
    this.lastMeasurement = 0;
    this.mqttChannel = 'Habilitado'
  }

  ngOnInit() {
    
    this.DeviceID = String(this.route.snapshot.paramMap.get('id'));

    this.db.getLastMeasurementByDevice(this.DeviceID)
      .then(reporte => {
        if (reporte) 
        {
          console.log("Exito obteniendo la última medición!")
          this.lastReport = reporte;
          this.lastMeasurement = reporte.Voltage;
        }
      })
      .catch(err => {
        console.error('Error obteniendo última medición', err);
      });
  }

  async toggleMqtt(deviceId: string, mqttChannel: string) {
    try {
      // ✅ Calcula el nuevo estado PRIMERO
      const newState = (mqttChannel === 'Habilitada') ? 'Deshabilitada' : 'Habilitada';
      
      // ✅ Envía el NUEVO estado al backend
      await this.IMqtt.enableMQTTChannelByDevice(deviceId, newState);
      
      // ✅ Solo actualiza la UI si el backend responde OK
      this.mqttChannel = newState;
      
      console.log(`✅ Canal MQTT cambiado a: ${newState}`);

    } catch (error) {
      console.error('⚠️ Error de comunicación con el servidor:', error);
      // Mostrar toast/alerta
    }
  }
}
