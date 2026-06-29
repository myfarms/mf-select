import { NgModule } from '@angular/core';

import { MfSelectComponent } from './mf-select.component';
import { MfOptionHighlightDirective } from './mf-option-highlight.directive';

export * from './mf-select.component';
export * from './mf-option-highlight.directive';

// Convenience NgModule for consumers still using NgModule-based apps.
// Standalone apps can import MfSelectComponent and MfOptionHighlightDirective directly.
@NgModule({
  imports: [
    MfSelectComponent,
    MfOptionHighlightDirective,
  ],
  exports: [
    MfSelectComponent,
    MfOptionHighlightDirective,
  ]
})
export class MfSelectModule {}
