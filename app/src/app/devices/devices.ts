import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Logger } from '../../services/logger';
import { IDevices } from '../interfaces/IDevices';
import { Database } from '../../services/database';
import { FromCelsiusToFarenheitPipe } from '../pipes/temp-pipe';
import { FromCelsiusToKelvinPipe    } from '../pipes/temp-pipe';
import { Highlight } from '../directives/highlight';

@Component({
  selector: 'app-devices',
  standalone : true,            // Este componente puede funcionar por si solo sin un "módulo"
  imports: [FormsModule, FromCelsiusToFarenheitPipe,FromCelsiusToKelvinPipe,Highlight],
  templateUrl: './devices.html',
  styleUrl: './devices.css'
})
export class Devices {

  buttonState: boolean;
  buttonText : string;
  currentTempInCelsius : number;

  db_devices : IDevices[];
  /* Declare logging service object */
  Logging : Logger;
  Database: Database;

  constructor()
  {
    this.buttonState = false;
    this.buttonText = "Press me";
    this.db_devices = [];
    this.currentTempInCelsius = 24;
    /* Inject logging with the service  */
    this.Logging = inject(Logger);
    this.Database = inject(Database);
  }

  getDevicesFromDatabase()
  {
    this.db_devices = this.Database.getDevices();
    
    console.log(this.db_devices);
  }

  changeButtonState()
  {
    this.buttonState = !this.buttonState;
  }

}
