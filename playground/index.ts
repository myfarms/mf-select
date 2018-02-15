/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { SampleModule }  from '../dist';

@Component({
  selector: 'app',
  template: `
    <div style='margin: 100px; width: 500px'>
      <sample-component></sample-component>
    </div>
  `
})
class AppComponent {}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, SampleModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
