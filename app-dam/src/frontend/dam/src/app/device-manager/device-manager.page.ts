import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { interval, Observable, Subscription } from 'rxjs';

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

  ob$ : Observable<any>;
  sub : Subscription;

  constructor() 
  {
    this.ob$ = interval(1000);
    this.sub = this.ob$.subscribe((value) => {console.log(value)});
  }

  UnsubscribeClick()
  {
    this.sub.unsubscribe();
  }

  SubscribeClick()
  {
    this.ob$ = interval(1000);
    this.sub = this.ob$.subscribe((value) => {console.log(value)});
  }
  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
