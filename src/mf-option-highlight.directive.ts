import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[mfOptionHighlight]'
})
export class MfOptionHighlightDirective implements OnChanges {
  @Input() public mfOptionHighlight: string;
  @Input() public innerHTML: string = '';

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const label = this.mfOptionHighlight || '';
    const indexOfTerm = this.innerHTML.toUpperCase().indexOf(label.toUpperCase());
    let html = this.innerHTML;
    if (indexOfTerm > -1) {
      html = this.innerHTML.substring(0, indexOfTerm)
            + '<span class=\'highlighted\'>' + this.innerHTML.substr(indexOfTerm, label.length) + '</span>'
            + this.innerHTML.substring(indexOfTerm + label.length, this.innerHTML.length);
    }
    this.setInnerHTML(html);
  }

  private setInnerHTML(html: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', html);
  }
}
