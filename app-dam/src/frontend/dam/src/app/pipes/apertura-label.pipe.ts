import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'aperturaLabel',
  standalone: true,
  pure: true,
})
export class AperturaLabelPipe implements PipeTransform {
  transform(value: unknown): string {
    // normalizamos a número 0/1 cuando es posible
    const n = (typeof value === 'string') ? Number(value) : value;

    if (n === 1 || n === true)  return 'abierta';
    if (n === 0 || n === false) return 'cerrada';

    return 'desconocido';
  }
}
