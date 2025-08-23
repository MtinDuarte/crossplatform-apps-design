import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { IDevices}  from '../interfaces/IDevices'


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  HTTPClient_ : HttpClient;

  constructor() 
  {
    this.HTTPClient_ = inject(HttpClient);
  }
  
  getDevices() : Promise <IDevices[]>
  {
      return firstValueFrom(this.HTTPClient_.get<IDevices[]>("http://localhost:8000/devices"));
  }
}
