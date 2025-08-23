import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DatabaseService } from '../../services/database.service';

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
  valveState: 'abierta' | 'cerrada' = 'cerrada';

  constructor() { }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    // acá podés traer la última medición desde la API si la tenés,
    // o desde el DevicesStateService si lo usás.
    // Ejemplo mock:
    this.ultimaMedicion = Math.floor(Math.random() * 100);
  }

  toggleValve() {
    // acá llamarías al endpoint que guarda Log_Riegos y Mediciones
    this.valveState = this.valveState === 'abierta' ? 'cerrada' : 'abierta';
    this.ultimaMedicion = Math.floor(Math.random() * 100);
    // TODO: usar this.db.toggleValve(this.id) cuando tengas el backend
  }

}
