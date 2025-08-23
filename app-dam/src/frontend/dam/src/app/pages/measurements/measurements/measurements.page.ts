import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonText, IonNote
} from '@ionic/angular/standalone';
import { DatabaseService } from '../../../services/database.service';
import { IMeasurements   } from '../../../interfaces/IMeasurements'

@Component({
  selector: 'app-measurements',
  standalone: true,
  templateUrl: './measurements.page.html',
  styleUrls: ['./measurements.page.scss'],
  imports: [
    CommonModule, RouterModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonText, IonNote
  ],
})
export class MeasurementsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private db = inject(DatabaseService);

  items: IMeasurements[];
  loading = false;
  
  constructor()
  {
    this.items = [];
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log("Sincronizando dispositivo con id: " + id);
    this.db.getMeasurementsByDevice(id)
    .then(res => {

      this.items = res;
      console.log("Measurement page result: " + res);
    })
    .catch(err => console.error(err))
  }
}
