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
  templateUrl: './app.html',
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
    'Lily',
    'Anna',
    'Shorty',
    'Chris',
    'Phil',
    'Dylan',
    'Laura',
    'Henery',
    'Texel',
    'Simon',
    'Really long name to make sure wrapping doesnt break it. it looks really ugly when it does'
  ].sort();

  public objectItems: any[] = this.stringItems.map((item, idx) => {
    return {
      id: idx + 1,
      name: item,
      category: idx % 2 === 0 ? 'Test' : 'Others',
    };
  });

  public tenThousandItems: string[] = [];

  constructor() {
    for (let i = 1; i <= 10000; i++) {
      this.tenThousandItems.push(i + '');
    }
  }

  public addItem(search: string) {
    alert(`Add Action: ${search}`);
  }

  public changeItems() {
    this.stringItems = [
      'first',
      'second',
      'last',
    ];

    this.ngModel = this.stringItems[1];
  }

  public changeModel() {
    this.ngModel = 'Adam';
  }

  public onChange(item: any) {
    console.log('onChange:', item);
  }
}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, FormsModule, MfSelectModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
