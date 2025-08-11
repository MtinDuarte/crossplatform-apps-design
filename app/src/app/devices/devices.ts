import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-devices',
  standalone : true,            // Este componente puede funcionar por si solo sin un "módulo"
  imports: [FormsModule],
  templateUrl: './devices.html',
  styleUrl: './devices.css'
})
export class Devices {

  buttonState: boolean;
  buttonText : string;
  constructor()
  {
    this.buttonState = false;
    this.buttonText = "Press me";
  }

  changeButtonState()
  {
    this.buttonState = !this.buttonState;
  }
}
