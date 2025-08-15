import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fromCelsiusToFarenheit',
  standalone : true,
})
export class FromCelsiusToFarenheitPipe implements PipeTransform {

  transform(value: number,): number {
    // (0°C × 9/5) + 32 = 32°F
    return ((value * 9/5) + 32);
  }
}
@Pipe({
  name: 'fromFarenheitToCelsius',
  standalone : true,
})
export class FromFarenheitToCelciusPipe implements PipeTransform {

  transform(value: number,): number {
    // (30°F − 32) × 5/9
    return ((value - 32) * 5/9);
  }
}
@Pipe({
  name: 'fromCelsiusToKelvin',
  standalone : true,
})
export class FromCelsiusToKelvinPipe implements PipeTransform {

  transform(value: number,): number {
    // °C + 273.15
    return ((value + 273.15));
  }
}

