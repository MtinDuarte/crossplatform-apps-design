// humidity-color.directive.ts
import { Directive, Input, OnChanges, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHumidityColor]',
  standalone: true,
})
export class HumidityColorDirective implements OnChanges {
  @Input('appHumidityColor') value: number | string | null | undefined;
  @Input() low = 30;   // < 30 => bajo
  @Input() high = 70;  // > 70 => alto

  constructor(private el: ElementRef, private r: Renderer2) {}

  ngOnChanges() {
    const v = this.value == null ? null : Number(this.value);
    // reset
    this.set('--background', null);
    this.set('border-left', null);
    this.set('--padding-start', null);

    if (v == null || isNaN(v)) return;

    // Paleta sutil
    let color = '#10b981', bg = 'rgba(16,185,129,0.08)';   // medio (verde)
    if (v < this.low) { color = '#ef4444'; bg = 'rgba(239,68,68,0.08)'; }   // bajo (rojo)
    if (v > this.high){ color = '#3b82f6'; bg = 'rgba(59,130,246,0.08)'; }  // alto (azul)

    // En ion-item: usar CSS vars en el host
    this.set('--background', bg);
    // Un acento visual al costado
    this.set('border-left', `6px solid ${color}`);
    this.set('--padding-start', '10px');
  }

  private set(prop: string, val: string | null) {
    this.r.setStyle(this.el.nativeElement, prop, val);
  }
}
