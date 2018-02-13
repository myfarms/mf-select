import { Component } from '@angular/core';

@Component({
  selector: 'sample-component',
  template: `
      <div>
        Select...
        <i class='fa fa-caret-down'></i>
      </div>
      <input type='text' placeholder='Select...' />
      <ul>
        <li *ngFor='let item of items'>
          {{ item }}
        </li>
      </ul>
  `,
  styles: [
    `
      li {
        background: blue;
      }
    `,
  ],
})
export class SampleComponent {

  public items: string[] = [
    'one',
    'two',
  ];

  constructor() {
    console.log('inside componenet');
  }

}
