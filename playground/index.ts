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
  }
}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, FormsModule, MfSelectModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
