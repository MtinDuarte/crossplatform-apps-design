import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { fromEvent, interval, Observable, Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { IDevices}  from '../interfaces/IDevices'

@Component({
  selector: 'app-device-manager',
  templateUrl: './device-manager.page.html',
  styleUrls: ['./device-manager.page.scss'],
  standalone : true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})
export class DeviceManagerPage implements OnInit , OnDestroy{

  /* Por regla de nomenclatura entre desarrolladores de angular, 
     se utiliza en variables observables colocar el signo '$' 
     para describir la variable.  
   */
  mouseMove$ = fromEvent(document,'mousemove');
  DBService : DatabaseService;
  DevicesGroup : IDevices[];

  constructor() 
  {
    this.DBService = inject(DatabaseService);
    this.DevicesGroup = [];
  }
  ngOnInit() {

    this.DBService.getDevices().then((res: IDevices[]) => 
    {
      this.DevicesGroup = res;
      console.log(res);
    }).catch((error) => 
    {
      console.log(error);
    })
  }

  ngOnDestroy(): void {
  }
}
