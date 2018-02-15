/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { MfSelectModule }  from '../dist';

@Component({
  selector: 'app',
  template: `
    <div style='margin: 100px; width: 500px'>
      <mf-select></mf-select>
    </div>
  `
})
class AppComponent {}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, MfSelectModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
