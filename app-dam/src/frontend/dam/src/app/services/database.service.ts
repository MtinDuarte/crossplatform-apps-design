import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { IDevices}  from '../interfaces/IDevices'
import { IMeasurements}  from '../interfaces/IMeasurements'

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  HTTPClient_ : HttpClient;
  private readonly base = 'http://localhost:8000';

  constructor() 
  {
    this.HTTPClient_ = inject(HttpClient);
  }
  
  getDevices() : Promise <IDevices[]>
  {
      return firstValueFrom(this.HTTPClient_.get<IDevices[]>(`${this.base}/devices`));
  }
  getMeasurementsByDevice(id:number) : Promise <IMeasurements[]>
  {
      return firstValueFrom(
        this.HTTPClient_.get<IMeasurements[]>(`${this.base}/devices/${id}/measurements`)
    );
  }
  getLastMeasurementByDevice(id:number) : Promise <IMeasurements>
  {
    return firstValueFrom(this.HTTPClient_.get<IMeasurements>((`${this.base}/devices/${id}/last-measurement`)))
  }
  backupMeasurementsAfterValveToggle(
    id: number
  ): Promise<{ humidity: number; valveState: 'abierta' | 'cerrada' }> {
    return firstValueFrom(
      this.HTTPClient_.post<{ humidity: number; valveState: 'abierta' | 'cerrada' }>(
        `${this.base}/devices/${id}/toggle`,
        {}
      )
    );
  }
}
