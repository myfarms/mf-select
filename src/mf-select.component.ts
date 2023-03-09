/**
 * Heavily based on the great project over at https://github.com/ng-select/ng-select
 * @author Adam Keenan <adam.keenan@myfarms.com>
 */

import {
  Component,
  ViewChild,
  ElementRef,
  forwardRef,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  HostBinding,
  HostListener,
} from '@angular/core';
import { Observable, isObservable } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';

export type MfSelectItem = string | object;

export interface MfCategory {
  categoryName: string;
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

@Component({
  selector: 'mf-select',
  templateUrl: './mf-select.component.html',
  styleUrls: ['./mf-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MfSelectComponent),
    multi: true,
  }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MfSelectComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor {

  @Input() public items: MfSelectItem[] | Observable<MfSelectItem[]>;
  @Input() public itemLabel: string = 'name';
  @Input() public categoryLabel?: string;
  @Input() public dropdownPosition: 'bottom' | 'top' | 'auto' = 'auto';
  @Input() public dropdownWidth: number;
  @Input() public appendTo: string;
  @Input() public placeholder: string = 'Select...';
  @Input() public placeholderLoading: string = 'Loading...';
  @Input() public allowClear: boolean = true;
  @Input() public loading: boolean = false;
  @Input() public floatingLabel: string | undefined;
  @Input() public backgroundColor: string = 'white';
  @Input() public floatingLabelColor: string = 'white';
  @Input() public optionRowHeight: number = 28;
  @Input() public disableOptionsByKey: string;

  @Output() public update: EventEmitter<MfSelectItem> = new EventEmitter<MfSelectItem>();

  @ViewChild('dropdownPanel', {static: false}) private dropdownPanel: ElementRef;
  @ViewChild('searchInput', {static: false})  private searchInput: ElementRef;
  @ViewChild(VirtualScrollComponent, {static: false}) private virtualScrollComponent: VirtualScrollComponent;

  @Input() public searchTemplateLeft: TemplateRef<any>;
  @Input() public searchTemplateRight: TemplateRef<any>;
  @Input() public selectedTemplate: TemplateRef<any>;
  @Input() public optionTemplate: TemplateRef<any>;
  @Input() public optionCategoryTemplate: TemplateRef<any>;



  public searchTerm: string = '';
  public filteredItems: MfSelectItem[] = [];
  public currentDropdownPosition: 'bottom' | 'top' | 'auto';
  public viewPortItems: MfSelectItem[] = [];

  @HostBinding('class') public parentClass = 'mf-select';
  @HostBinding('class.open') public isOpen: boolean = false;
  @HostBinding('class.disabled') public isDisabled: boolean = false;
  @HostBinding('tabindex') public tabindex = 0;

  public isFocused: boolean = false;

  public get selectedItem() {
    return this.model;
  }

  private _items: MfSelectItem[] = [];

  private observableLoading: boolean = false;
  private model: MfSelectItem = null;
  private _markedItem: number = 0;
  private set markedItem(val: number) {
    val = this.findNextNonCategoryItem(val);
    this._markedItem = Math.max(val, 0);
  }
  private get markedItem(): number {
    return this._markedItem;
  }

  private onChange = (_: MfSelectItem) => { };
  private onTouched = () => { };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  public ngOnInit(): void {
    this.filteredItems = this._items || [];
    this.filteredItems = this.processCategories();

    this.markedItem = this.findNextNonCategoryItem(0);
  }

  public ngAfterViewInit(): void {
    if (this.appendTo) {
      const parent = document.querySelector(this.appendTo);
      if (!parent) {
        throw new Error(`appendTo selector ${this.appendTo} did not find any parent element`)
      }
      parent.appendChild(this.dropdownPanel.nativeElement);
      // this._handleDocumentResize();
      this.updateAppendedDropdownPosition();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dropdownPosition) {
      this.currentDropdownPosition = changes.dropdownPosition.currentValue;
    }

    if (changes.items) {
      if (isObservable(changes.items.currentValue)) {
        this.observableLoading = true;

        changes.items.currentValue.subscribe((items: MfSelectItem[]) => {
          this.observableLoading = false;
          this._items = items;

          // Update filteredItems
          this.onSearch(this.searchTerm);

          this.markedItem = this.findNextNonCategoryItem(this.markedItem || 0);

          if (!(<any>this.changeDetectorRef).destroyed) {
            this.changeDetectorRef.detectChanges();
          }
        });
      } else {
        this._items = changes.items.currentValue;

        // Update filteredItems
        this.onSearch(this.searchTerm);

        this.markedItem = this.findNextNonCategoryItem(this.markedItem || 0);
      }
    }
  }

  public ngOnDestroy(): void {
    this.changeDetectorRef.detach();
    if (this.appendTo) {
      this.elementRef.nativeElement.appendChild(this.dropdownPanel.nativeElement);
    }
  }

  // @HostListener('focus')
  // public focusHandler() {
  //   this.isFocused = true;
  // }

  // @HostListener('blur')
  // public blurHandler() {
  //   this.isFocused = false;
  // }

  @HostListener('keydown', ['$event'])
  public onRootKeydown($event: KeyboardEvent): void {
    switch ($event.code) {
      case 'Space':
      case 'Enter':
        this.open();
        $event.preventDefault();
        break;
      case 'Backspace':
        if (this.allowClear) {
          this.clear();
        }
        $event.preventDefault();
        break;
      default:
        // The key pressed is likely intended to be used as a search term
        if ($event.ctrlKey === false && $event.altKey === false && $event.metaKey === false && $event.key.length === 1) {
          this.open();
          this.searchInput.nativeElement.value = $event.key;
          this.onSearch($event.key);
          $event.preventDefault();
        }
        break;
    }
  }

  // Only works when search input is focused
  public onKeydown($event: KeyboardEvent): void {
    switch ($event.code) {
      case 'ArrowDown':
        this.open();
        this.markedItem = this.findNextNonCategoryItem(this.markedItem !== undefined ? this.markedItem + 1 : 0);
        if (this.markedItem !== undefined) {
          this.virtualScrollComponent.scrollInto(this.filteredItems[this.markedItem]);
        }
        $event.preventDefault();
        break;
      case 'ArrowUp':
        // Also skip over any categories when moving upward
          this.markedItem = this.findPreviousNonCategoryItem(this.markedItem !== undefined ? this.markedItem - 1 : 0);
        if (this.markedItem !== undefined) {
          this.virtualScrollComponent.scrollInto(this.filteredItems[this.markedItem]);
        }
        $event.preventDefault();
        break;
      case 'Space':
        // this._handleSpace($event);
        break;
      case 'Enter':
        if (this.markedItem === undefined) {
          return;
        }
        const item = this.filteredItems[this.markedItem];
        if (!item) {
          return;
        }
        this.selectItem(item);
        this.elementRef.nativeElement.focus();
        break;
      case 'Tab':
      case 'Escape':
        this.close();
        this.elementRef.nativeElement.focus();
        break;
    }
  }

  public toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  public open(): void {
    if (this.isDisabled || this.isOpen || this.loading || this.observableLoading) { return; }

    this.isOpen = true;

    // Focus search
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    });

    if (this.dropdownPosition === 'auto') {
      this.autoPositionDropdown();
    }
    if (this.appendTo) {
      this.updateAppendedDropdownPosition();
    }
  }

  public close(): void {
    if (this.isDisabled || !this.isOpen) {
      return;
    }

    this.isOpen = false;
  }

  public clear(): void {
    this.selectItem(null);
  }

  public onSearch(search: string): void {
    this.searchTerm = search;
    this.filteredItems = search ? this._items.filter((item: MfSelectItem) => {
      const value: string = this.getLabel(item);
      return !this.isMfCategory(item) && value.toUpperCase().indexOf(search.toUpperCase()) > -1;
    }) : this._items || [];

    this.filteredItems = this.processCategories();

    this.markedItem = this.findNextNonCategoryItem(0);
  }

  public selectItem(item: MfSelectItem): void {
    if (this.isDisabled || this.isMfCategory(item) || this.isDisabledItem(item)) { return; }
    this.model = item;
    this.markedItem = this.filteredItems.indexOf(this.model);
    this.onChange(this.model);
    this.update.emit(this.model);
    this.close();
  }

  public getLabel(item: MfSelectItem): string {
    if (!item) { return null; }
    return typeof item === 'string' ? item : (item[this.itemLabel] || item.toString());
  }









  /**
   * ControlValueAccessor Methods
   */
  public writeValue(value: MfSelectItem): void {
    this.model = value;
    this.markedItem = this.filteredItems.indexOf(this.model);

    if (!(<any>this.changeDetectorRef).destroyed) {
      this.changeDetectorRef.detectChanges();
    }

    this.update.emit(value);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }


  /**
   * Positioning Methods
   */

  private getDropdownMenu(): HTMLElement {
    if (!this.isOpen /*|| !this.dropdownList*/) {
      return null;
    }

    return <HTMLElement>this.dropdownPanel.nativeElement;
  }


  private autoPositionDropdown(): void {
    const selectRect = this.elementRef.nativeElement.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const offsetTop = selectRect.top + window.pageYOffset;
    const height = selectRect.height;
    const dropdownPanel = this.getDropdownMenu();
    if (!dropdownPanel) { return; }
    const dropdownHeight = dropdownPanel.getBoundingClientRect().height;

    if (offsetTop + height + dropdownHeight > scrollTop + document.documentElement.clientHeight) {
      this.currentDropdownPosition = 'top';
    } else {
      this.currentDropdownPosition = 'bottom';
    }
  }

  private updateAppendedDropdownPosition(): void {
    const select: HTMLElement = this.elementRef.nativeElement;
    const dropdownPanel = this.getDropdownMenu();
    if (!dropdownPanel) { return; }
    const parentRect = dropdownPanel.parentElement.getBoundingClientRect();
    const selectRect = select.getBoundingClientRect();
    const offsetTop = selectRect.top - parentRect.top;
    const offsetLeft = selectRect.left - parentRect.left;
    const topDelta = this.currentDropdownPosition === 'top' ? -(dropdownPanel.getBoundingClientRect().height + 6) : selectRect.height;
    dropdownPanel.style.top = offsetTop + topDelta + 'px';
    dropdownPanel.style.bottom = 'auto';
    dropdownPanel.style.left = offsetLeft + 'px';
    if (!this.dropdownWidth) {
      dropdownPanel.style.width = selectRect.width + 'px';
    }
  }

  private processCategories(): MfSelectItem[] {
    if (this.categoryLabel === undefined) { return this.filteredItems; }

    const categorySet: Set<string> = new Set([]);
    for (const item of this.filteredItems) {
      categorySet.add(item[this.categoryLabel]);
    }

    const categories = Array.from(categorySet.values()).sort();

    const itemsWithCategories: MfSelectItem[] = [];
    for (const category of categories) {
      itemsWithCategories.push({ categoryName: category });

      for (const item of this.filteredItems) {
        if (item[this.categoryLabel] === category) {
          itemsWithCategories.push(item);
        }
      }
    }

    return itemsWithCategories;
  }

  private isMfCategory(item: MfSelectItem): item is MfCategory {
    return item && (<MfCategory> item).categoryName !== undefined;
  }

  private isDisabledItem(item: MfSelectItem): boolean {
    return item && typeof(item) === 'object' && this.disableOptionsByKey && item[this.disableOptionsByKey];
  }

  private findPreviousNonCategoryItem(pos: number): number | undefined {
    // Make sure the position is between 0 and the length of the list
    pos = Math.max(0, Math.min(this.filteredItems.length - 1, pos));

    const offset = this.filteredItems.slice(0, pos + 1)
      .reverse()
      .findIndex((item: MfSelectItem) => !this.isMfCategory(item) && !this.isDisabledItem(item));

    // We found what we need
    if (offset !== -1) {
      return pos - offset;
    }

    return this.markedItem;
  }

  private findNextNonCategoryItem(pos: number): number | undefined {
    // Make sure the position is between 0 and the length of the list
    pos = Math.max(0, Math.min(this.filteredItems.length - 1, pos));

    const offset = this.filteredItems.slice(pos)
      .findIndex((item: MfSelectItem) => !this.isMfCategory(item) && !this.isDisabledItem(item));

    // We found what we need
    if (offset !== -1) {
      return pos + offset;
    }

    return this.markedItem;
  }
}
