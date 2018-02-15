import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualScrollModule } from 'angular2-virtual-scroll';

import { MfSelectComponent } from './mf-select.component';
import { MfSelectDirective } from './mf-select.directive';
import { MfSelectPipe } from './mf-select.pipe';
import { MfSelectService } from './mf-select.service';

export * from './mf-select.component';
export * from './mf-select.directive';
export * from './mf-select.pipe';
export * from './mf-select.service';

@NgModule({
  imports: [
    CommonModule,
    VirtualScrollModule,
  ],
  declarations: [
    MfSelectComponent,
    MfSelectDirective,
    MfSelectPipe,
  ],
  exports: [
    MfSelectComponent,
    MfSelectDirective,
    MfSelectPipe,
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
