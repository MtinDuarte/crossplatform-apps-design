# Angular - Data Binding 🅰️

Este documento muestra ejemplos prácticos de **vinculación de propiedades (bindings)** en Angular, tanto en una sola dirección (*one-way*) como en dos direcciones (*two-way*).  

## 🔗 One-way Binding

Permite enviar datos **desde el controlador (TS)** hacia la vista (HTML). No requiere modificar el HTML, ya que todo el comportamiento se controla desde el componente.

### Ejemplo de botón con binding a `buttonState`
```html
<h1>One way - binding</h1>
<button [disabled]="buttonState" (click)="changeButtonState()">
  {{buttonText}}
</button>
```



Sintaxis

- Property Binding
```html
[property]="variable"
```

- Event Binding
```html
(event)="methodName()"
```

- Interpolation
```html
<element>{{variable}}</element>
```


🔁 Two-way Binding

Enlaza datos en ambas direcciones:

Si el valor cambia en el controlador, también cambia en el HTML.

Si el usuario modifica el HTML (ej: un input), también se actualiza en el controlador.

⚠️ Requiere importar el módulo de formularios (FormsModule).


Ejemplo con [(ngModel)]

```html
<h1>Two way - binding</h1>
<input type="text" [(ngModel)]="buttonText">
```


🔥 Ejemplo práctico con if/else
```html
<p>
  Uso de If/else mediante el botón "Press me".  
  Si el botón no está presionado, muestra °K.  
  Si se presiona, muestra °F (temperatura base 24°C).
</p>

@if (buttonState) {
  <p>La temperatura es: {{currentTempInCelsius | fromCelsiusToFarenheit}} °F</p>
} @else {
  <p>La temperatura es: {{currentTempInCelsius | fromCelsiusToKelvin}} °K</p>
}
```


🔄 Ejemplo con bucles (@for)

```html
<p>Uso de for:</p>

@for (item of db_devices; track item.id) {
  <p>
    ID: {{item.id}};  
    Nombre: {{item.name}};  
    Localización: {{item.location}}
  </p>
} @empty {
  <p appHighlight>No hay dispositivos</p>
}
```


📌 Resumen

- One-way binding: flujo de datos del componente a la vista.

- Two-way binding: sincroniza datos entre la vista y el componente.

- Directivas estructurales (@if, @for) permiten condicionar o iterar contenido dinámicamente.

- Se pueden aplicar pipes personalizados (ej: fromCelsiusToFarenheit) para transformar datos en la vista.