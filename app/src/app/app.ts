import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/* Esto se denomina Decorador */
@Component({                    /* Metadata.... */
  selector: 'app-root',         // Etiqueta (así se usa en html)
  imports: [RouterOutlet],      // Módulos que usa este componente
  templateUrl: './app.html',    // Archivo template
  styleUrl: './app.css'         // Estilos
})
export class App {
  protected title = 'app';
}
