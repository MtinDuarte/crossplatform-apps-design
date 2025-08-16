import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeviceManager } from './device-manager/device-manager';

/* Esto se denomina Decorador */
@Component({                              /* Metadata.... */
  selector: 'app-root',                   // Etiqueta (así se usa en html)
  standalone : true,                      // No necesita módulos
  imports: [RouterOutlet, DeviceManager],       // Módulos que usa este componente
  templateUrl: './app.component.html',    // Archivo template
  styleUrl:    './app.component.css',      // Estilos
})
export class App {
  protected title = 'app';
}
