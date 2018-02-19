import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualScrollModule } from 'angular2-virtual-scroll';

import { MfSelectComponent } from './mf-select.component';
import { MfOptionHighlightDirective } from './mf-option-highlight.directive';
import { MfSelectService } from './mf-select.service';

export * from './mf-select.component';
export * from './mf-select.service';

@NgModule({
  imports: [
    CommonModule,
    VirtualScrollModule,
  ],
  declarations: [
    MfSelectComponent,
    MfOptionHighlightDirective,
  ],
  exports: [
    MfSelectComponent,
    MfOptionHighlightDirective,
  ]
})
export class MfSelectModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MfSelectModule,
      providers: [MfSelectService]
    };
  }
}
