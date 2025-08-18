import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { IDevices}  from '../interfaces/IDevices'


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  
  /* CORS handling  */
  // corsOptions =
  // {
  //     // Cualquier origen es permitido [Sólo desarrollo]
  //     origin : '*'
  // }

  HTTPClient_ : HttpClient;

  constructor() 
  {
    this.HTTPClient_ = inject(HttpClient);
    // this.HTTPClient_.use(cors(this.corsOptions));
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
       
  // getDevices() : Observable<object>
  // {
  //     return this.HTTPClient_.get("http://localhost:8000/devices");
  // }

  getDevices() : Promise <IDevices[]>
  {
      return firstValueFrom(this.HTTPClient_.get<IDevices[]>("http://localhost:8000/devices"));
  }
}
