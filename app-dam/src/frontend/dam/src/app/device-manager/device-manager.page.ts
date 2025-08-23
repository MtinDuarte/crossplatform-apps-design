import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton,
         IonCard,IonCardContent,IonCardHeader,IonCardSubtitle,IonCardTitle, IonList, IonLabel, IonItem} from '@ionic/angular/standalone';
import { fromEvent, interval, Observable, Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { IDevices}  from '../interfaces/IDevices'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-device-manager',
  templateUrl: './device-manager.page.html',
  styleUrls: ['./device-manager.page.scss'],
  standalone : true,
  imports: [RouterModule, IonContent, IonHeader, IonTitle, IonToolbar,
            CommonModule,FormsModule, IonButton, IonButton, IonCard,
            IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
            IonList, IonLabel,IonItem]
})
export class DeviceManagerPage implements OnInit , OnDestroy{

  /* Por regla de nomenclatura entre desarrolladores de angular, 
     se utiliza en variables observables colocar el signo '$' 
     para describir la variable.  
   */
  mouseMove$ = fromEvent(document,'mousemove');
  DBService : DatabaseService;

  DevicesGroup : IDevices[];
  Router : ActivatedRoute;
  // Comunicación entre device-manager => devices   (Padre => hijo)
  @Input()
  id = '';


  ionViewWillEnter()
  {
    console.log(this.Router.snapshot.paramMap.get('id'));
  }
  constructor() 
  {
    this.Router = inject(ActivatedRoute);
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
