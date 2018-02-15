import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[mfSelectDirective]'
})
export class MfSelectDirective {

  constructor(private el: ElementRef) {
    console.log(this.el);
  }

}
