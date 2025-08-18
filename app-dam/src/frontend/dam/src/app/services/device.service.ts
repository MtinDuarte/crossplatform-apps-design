import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  HTTPClient_ : HttpClient;
  
  constructor() 
  {
    this.HTTPClient_ = inject(HttpClient);
  }

  // Qué es un observable? 
  //   Es parecido a MQTT; en sentido que maneja un patrón de tipo
  //   subscripción/publicación. Alguien se subscribe a un observable,
  //   y si estas subscripto a como quien diría un tópico, entonces
  //   te llega un mensaje asíncrono, es decir que no sabes cuando
  //   podría llegarte. Permite manejar eventos y es posible cancelar o
  //   el equivalente a desubscribirse. 
  //   El flujo en este caso sería que la API es el publisher, y este
  //   método sería el que se subscribe a la respuesta del request. 
  //   Luego de la respuesta de la API, la subscrición se cancela
       
  getDevices() : Observable<object>
  {
      return this.HTTPClient_.get("http://localhost:8000/devices");
  }
}
