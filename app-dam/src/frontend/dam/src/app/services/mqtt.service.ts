import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MqttService {

  HTTPClient_ : HttpClient;
  private readonly base = 'http://localhost:8000';

  constructor() 
  {
    this.HTTPClient_ = inject(HttpClient);
  }

/**
   * Llama al backend para habilitar el canal MQTT para un dispositivo específico.
   * Se espera que el endpoint devuelva true o false.
   * @param id El ID del dispositivo.
   * @returns Una Promesa que se resuelve con un booleano (true/false).
   */
  enableMQTTChannelByDevice(id: string, enable: string): Promise<boolean> {
    
    const url = `${this.base}/devices/${id}/enable-mqtt/${enable}`;
    
    return firstValueFrom(this.HTTPClient_.post<boolean>(url, { })); 
  }
}
