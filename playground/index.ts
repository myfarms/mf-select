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
    <h1>Examples</h1>
    <div style='margin: 100px; width: 500px'>
      <mf-select [(ngModel)]='ngModel' [items]='stringItems'></mf-select>
    </div>

    Model: {{ ngModel | json }}

    <div style='margin: 100px; width: 500px'>
      <mf-select [(ngModel)]='ngModelObject' [items]='objectItems'></mf-select>
    </div>
    Model: {{ ngModelObject | json }}


    <h1>Append To Body</h1>
    <div style='margin: 100px; width: 500px'>
      <mf-select [items]='objectItems' dropdownPosition='auto' appendTo='body'></mf-select>
    </div>

    <h1>Append To Blue Box -></h1>
    <div style='margin: 100px; width: 500px'>
      <mf-select [items]='objectItems' dropdownPosition='auto' appendTo='#bs4-container'></mf-select>
    </div>

    <h1>Expanded dropdown</h1>
    <div style='margin: 100px; width: 150px'>
      <mf-select [items]='objectItems' [dropdownWidth]='500'></mf-select>
    </div>

    <h1>Dropup</h1>
    <div style='margin: 100px; width: 500px'>
      <mf-select [items]='objectItems' dropdownPosition='auto'></mf-select>
    </div>


    <div id='bs4-container'
      style='position:absolute; top: 900px; left: 700px; width: 500px; height: 200px; background: rgba(0, 0, 255, 0.5);'
    ></div>
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
