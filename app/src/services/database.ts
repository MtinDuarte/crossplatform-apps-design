import { Injectable } from '@angular/core';
import { IDevices } from '../app/interfaces/IDevices';

@Injectable({
  providedIn: 'root'
})
export class Database {
  
  constructor() { }

  getDevices() : IDevices []
  {
    return [
      {
        id : 1,
        name : "Microwave",
        location: "Kitchen"       
      },
      {
        id : 2,
        name : "Sofa",
        location: "Living Room"        
      },
    ]
  }
}
