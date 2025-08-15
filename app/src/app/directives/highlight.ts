import {Directive, ElementRef, HostListener, inject} from '@angular/core';

// Import ElementRef from @angular/core. 
// ElementRef grants direct access to the host DOM element through its nativeElement property.


@Directive({
  selector: '[appHighlight]'
})
export class Highlight {

  // Add ElementRef in the directive's constructor()
  //  to inject a reference to the host DOM element,
  //  the element to which you apply appHighlight.
  private el = inject(ElementRef);

  constructor() 
  {
    this.el.nativeElement.style.backgroundColor = 'red';
  }
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('yellow');
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) 
  {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
