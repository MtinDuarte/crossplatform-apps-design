import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Devices } from "./devices/devices";
import { Logger } from '../services/logger';

/* Esto se denomina Decorador */
@Component({                              /* Metadata.... */
  selector: 'app-root',                   // Etiqueta (así se usa en html)
  standalone : true,                      // No necesita módulos
  imports: [RouterOutlet, Devices],       // Módulos que usa este componente
  templateUrl: './app.component.html',    // Archivo template
  styleUrl:    './app.component.css',      // Estilos
})
export class App {
  protected title = 'app';
}
