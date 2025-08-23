import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { IMeasurements  } from '../../interfaces/IMeasurements'

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

  id!: number;
  ultimaMedicion?: number;
  ultimoReporte?: IMeasurements;
  valveState: string;

  constructor() 
  {
    this.ultimaMedicion = 0;
    this.valveState = 'cerrada'
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.db.getLastMeasurementByDevice(this.id)
      .then(reporte => {
        if (reporte) 
        {
          console.log("Exito obteniendo la última medición!")
          this.ultimoReporte = reporte;
          this.ultimaMedicion = reporte.valor;
        }
      })
      .catch(err => {
        console.error('Error obteniendo última medición', err);
      });
  }

  toggleValve() {
    this.db.backupMeasurementsAfterValveToggle(this.id)
      .then(({ humidity, valveState }) => {
        // Refrescar estos datos en pantalla como "utima medición"
        
        this.ultimaMedicion = humidity;
        this.valveState = valveState; // 'abierta' | 'cerrada'
      })
      .catch(err => {
        console.error('Error al togglear válvula', err);
      });
  } 
}
