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
      <mf-select [(ngModel)]='ngModel' [items]='stringItems'></mf-select>
    </div>

    Model: {{ ngModel | json }}

    <div style='margin: 100px; width: 500px'>
      <mf-select [(ngModel)]='ngModelObject' [items]='objectItems'></mf-select>
    </div>
    Model: {{ ngModelObject | json }}

    <h1>Dropup</h1>
    <div style='margin: 100px; width: 500px'>
      <mf-select [(ngModel)]='ngModelObject' [items]='objectItems' dropdownPosition='auto'></mf-select>
    </div>
    Model: {{ ngModelObject | json }}
  `
})
class AppComponent {
  public ngModel: string = 'Jenni';
  public ngModelObject: any = {
    id: 1,
    name: 'Adam',
  };

  public stringItems: string[] = [
    'Kelly',
    'Adam',
    'Jesse',
    'Anna',
    'Shorty',
    'Chris',
    'Phil',
    'Dylan',
    'Laura',
    'Henery',
    'Texel',
  ].sort();
  public objectItems: any[] = this.stringItems.map((item, idx) => {
    return {
      id: idx + 1,
      name: item,
    };
  });

  constructor() {
  }
}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, FormsModule, MfSelectModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
