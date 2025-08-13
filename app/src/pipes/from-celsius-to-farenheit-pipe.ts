import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fromCelsiusToFarenheit'
})
export class FromCelsiusToFarenheitPipe implements PipeTransform {

  transform(value: number,): number {
    // (0°C × 9/5) + 32 = 32°F
    return ((value * 9/5) + 32);
  }
}
