import { Component, inject , Input, input, output  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Logger } from '../../services/logger';
import { IDevices } from '../interfaces/IDevices';

@Component({
  selector: 'app-devices',
  standalone : true,            // Este componente puede funcionar por si solo sin un "módulo"
  imports: [FormsModule],
  templateUrl: './devices.html',
  styleUrl: './devices.css'
})
export class Devices 
{
  @Input()
  Device : any;

  OnChange = output<any>();
  /* Declare logging service object */
  Logging : Logger;

  constructor()
  {
    /* Inject logging with the service  */
    this.Logging = inject(Logger);
  }

  changeLocation()
  {
     this.Device.location = 'Nueva ubicación';
     this.OnChange.emit(this.Device);
  }
}
