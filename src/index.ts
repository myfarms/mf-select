import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

import { MfSelectComponent } from './mf-select.component';
import { MfOptionHighlightDirective } from './mf-option-highlight.directive';
// import { MfSelectService } from './mf-select.service';

export * from './mf-select.component';
export * from './mf-option-highlight.directive';

@NgModule({
  imports: [
    CommonModule,
    VirtualScrollerModule,
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
  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: MfSelectModule,
  //     providers: [MfSelectService]
  //   };
  // }
}
