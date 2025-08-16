import { Component, inject, OnInit } from '@angular/core';
import { Database } from '../../services/database';
import { IDevices } from '../interfaces/IDevices';
import { Devices } from '../devices/devices';

@Component({
  selector: 'app-device-manager',
  imports: [Devices],
  standalone : true,
  templateUrl: './device-manager.html',
  styleUrl: './device-manager.css'
})
export class DeviceManager implements OnInit{

  Database: Database;
  db_devices : IDevices[];

  constructor()
  {
    this.Database = inject(Database);    
    this.db_devices = [];
  }
  ngOnInit(): void {
    
  }
  
  getDevicesFromDatabase()
  {
    this.db_devices = this.Database.getDevices();
    
    console.log(this.db_devices);
  }

  onChangeHandler(eventData: any)
  {
    console.log("From OnChangeHandler: ");
    console.log(eventData);
  }
}
