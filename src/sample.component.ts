import {
  Component,
  ViewChild,
  ElementRef,
  forwardRef,
  OnInit,
  Renderer2,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';

@Component({
  selector: 'sample-component',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SampleComponent),
    multi: true,
  }],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {


  @Input() public items: string[] = [];
  @ViewChild('searchInput') private searchInput: ElementRef;
  @ViewChild(VirtualScrollComponent) private scrollComponent: VirtualScrollComponent;

  public isOpen: boolean = false;
  public isDisabled: boolean = false;
  public search: string = '';
  public filteredItems: string[] = [];

  private model: any = null;
  private onChange = (_: any) => { };
  private onTouched = () => { };
  private disposeDocumentClickListener = () => { };
  private disposeDocumentResizeListener = () => { };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    for (let i = 1; i <= 10000; i++) {
      this.items.push(i + '');
    }
    this.filteredItems = this.items;
  }

  public ngOnInit() {
    this.setupDocumentClick();
    this.open();
  }

  public ngAfterViewInit() {
    // this.renderer.listen(this.searchInput.nativeElement, 'blur', ($event) => {
    //   console.log('onblur');
    //   this.close();
    // });
    console.log(this.scrollComponent);
  }

  public ngOnDestroy() {
    this.changeDetectorRef.detach();
    this.disposeDocumentClickListener();
    this.disposeDocumentResizeListener();
  }

  // Only works when search input is focused
  @HostListener('keydown', ['$event'])
  public handleKeyDown($event: KeyboardEvent) {
      console.log('handleKeyDown', $event.which);
      if (KeyCode[$event.which]) {
          switch ($event.which) {
              case KeyCode.ArrowDown:
                  this.open();
                  // markNextItem
                  // this.dropdownList.scrollInto(this.itemsList.markedItem);
                  $event.preventDefault();
                  break;
              case KeyCode.ArrowUp:
                  // this._handleArrowUp($event);
                  break;
              case KeyCode.Space:
                  // this._handleSpace($event);
                  break;
              case KeyCode.Enter:
                  // this._handleEnter($event);
                  break;
              case KeyCode.Tab:
                  // this._handleTab($event);
                  break;
              case KeyCode.Backspace:
                  // this._handleBackspace();
                  break;
          }
      }
  }

  public toggle() {
    this.isOpen ? this.close() : this.open();
  }

  public open() {
    this.isOpen = true;

    // Focus search and select all text
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
      this.searchInput.nativeElement.select();
    });
  }

  public close() {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    // Maybe clear search?
  }

  public onSearch(search: string) {
    console.log(search);
    this.search = search;
    this.filteredItems = search ? this.items.filter((val) => {
      return val.toUpperCase().indexOf(search.toUpperCase()) > -1;
    }) : this.items;
  }

  /**
   * ControlValueAccessor Methods
   */
  public writeValue(value: any | any[]): void {
    this.model = value;
    // this._validateWriteValue(value);
    // this.itemsList.clearSelected();
    // this._selectWriteValue(value);

    if (!(<any>this.changeDetectorRef).destroyed) {
      this.changeDetectorRef.detectChanges();
    }
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }





  private setupDocumentClick() {
    this.disposeDocumentClickListener = this.renderer.listen('window', 'click', ($event: any) => {
      // Don't close if clicked on select
      if (this.elementRef.nativeElement.contains($event.target)) {
        // console.log('inside select');
        return;
      }

      const dropdown = this.getDropdownMenu();
      if (dropdown && dropdown.contains($event.target)) {
        console.log('inside dropdown');
        return;
      }

      this.close();
    });
  }

  private getDropdownMenu(): HTMLElement {
    if (!this.isOpen /*|| !this.dropdownList*/) {
      return null;
    }

    return <HTMLElement>this.elementRef.nativeElement.querySelector('.ng-menu-outer');
  }
}

export enum KeyCode {
  Tab = 9,
  Enter = 13,
  Esc = 27,
  Space = 32,
  ArrowUp = 38,
  ArrowDown = 40,
  Backspace = 8
}
