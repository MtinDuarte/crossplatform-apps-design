# Servicios en Angular

Los **servicios** en Angular se utilizan para encapsular lógica de negocio y tareas reutilizables dentro de la aplicación.

---

## 📌 ¿Qué es un servicio?

- Se usan para **tareas de lógica de negocio**.
- Cualquier tarea asociada a **guardar datos puntuales** para un componente puede definirse como un servicio.
- Una **request al backend** es un ejemplo claro de acción para un servicio.
- Muchos de los *drivers* que en otros proyectos se colocan en una carpeta `utils` pueden encajar como servicios.
- Angular crea un **inyector** para toda la aplicación, que conecta **consumidores** (componentes) y **proveedores** (servicios).

---

## 🛠 Crear un servicio

Comando general:

```bash
ng generate service <path>
```

Ejemplo: crear un servicio de logging en la carpeta services:

```bash
ng generate service services/logger
```

⚙️Funcionamiento

Si un componente utiliza un servicio, Angular creará una única instancia del servicio y la compartirá en toda la aplicación.

Si Angular detecta en compilación que un servicio no se utiliza, no lo instanciará.

Por defecto, Angular decora el servicio con @Injectable y lo asigna a nivel de raíz (providedIn: 'root').

```typescript
import { Injectable } from '@angular/core';

    @Injectable({
    providedIn: 'root'
    })
    export class Logger { }
```

🗂 Ámbito de un servicio

1️⃣ A nivel de raíz (por defecto)
Se comparte una sola instancia en toda la app.

Declarado con providedIn: 'root'.

2️⃣ A nivel de componente
Se crea una nueva instancia cada vez que se instancia el componente.

Para hacerlo, elimina providedIn: 'root' del servicio y agrega el providers en el decorador del componente:

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Devices } from './devices.component';
import { Logger } from './services/logger.service';

@Component({                             
  selector: 'app-root',                   
  standalone: true,                     
  imports: [RouterOutlet, Devices],      
  templateUrl: './app.component.html',    
  styleUrls: ['./app.component.css'],
  providers: [Logger] // 👈 Servicio con ámbito de componente
})
export class AppComponent {}

```


3️⃣ A nivel de aplicación (en app.config.ts)

Alternativa a providedIn: 'root' para declarar proveedores globales.

El servicio sigue siendo perezoso: no se instancia hasta que alguien lo inyecta.

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { Logger } from './services/logger.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    Logger // 👈 Proveedor a nivel de aplicación
  ]
};
```

💡 Usa app.config.ts cuando quieras centralizar la configuración de providers en aplicaciones con standalone components.



📚 Resumen visual

| Ámbito         | Instancias creadas                 | Instanciación          | Uso común            |
| -------------- | ---------------------------------- | ---------------------- | -------------------- |
| **Root**       | 1 instancia global                 | Perezosa               | Lógica compartida    |
| **Componente** | 1 por instancia de componente      | Al crear el componente | Datos/estado aislado |
| **Aplicación** | 1 instancia global (cuando se usa) | Perezosa               | Servicios esenciales |
