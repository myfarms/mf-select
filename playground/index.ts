/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule } from '@angular/forms';

import { MfSelectModule }  from '../dist';

@Component({
  selector: 'app',
  template: `
    <div style='margin: 100px; width: 500px'>
      <mf-select [(ngModel)]='ngModel'></mf-select>
    </div>

    Model: {{ ngModel | json }}
  `
})
class AppComponent {}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, FormsModule, MfSelectModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
