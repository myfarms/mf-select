# @myfarms/mf-select

Playground: <https://stackblitz.com/edit/mf-select>

## Getting started

### Step 1: Install `@myfarms/mf-select`

```bash
$ npm install @myfarms/mf-select --save
```

### Step 2: Import the MfSelectModule

```typescript
import { NgModule } from '@angular/core';

import { MfSelectModule } from '@myfarms/mf-select';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    MfSelectModule,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
```

### Step3: Use the component in your template

```xml
<mf-select
  [items]='items'
></mf-select>
```

## API
### Inputs

| Input  | Type | Default | Description |
| ------------- | ------------- | ------------- | ------------- |
| items | `string[]` &#124; `object[]` | `[]` | Items array |
| itemLabel  | `string` | `'name'` | Object property to use for label |
| categoryLabel | string | 'category' | Grouping based on category, with category header rows |
| appendTo | `string` |  `null` | Append dropdown to body or any other element using css selector |
| dropdownPosition | `'bottom'` &#124; `'top'` &#124; `'auto'` | `'auto'` | Set the dropdown position on open |
| dropdownWidth | `number` | `-` | Static width of the dropdown in pixels |
| placeholder | `string` | `'Select...'` | Placeholder text |
| searchTemplateLeft | `TemplateRef<any>` | `-` | Template for content left of search |
| searchTemplateRight | `TemplateRef<any>` | `-` | Template for content right of search |
| selectedTemplate | `TemplateRef<any>` | `-` | Template for content of selected item |
| optionTemplate | `TemplateRef<any>` | `-` | Template for content of each item in the dropdown |
| optionCategoryTemplate | `TemplateRef<any>` | `-` | Template for content of each category header in the dropdown |

### Outputs

| Output  | Description |
| ------------- | ------------- |
| (update)  | Fired on selected value change |

### Methods and Properties

| Name  | Description |
| ------------- | ------------- |
| selectedItem | The selected item |
| toggle() | Opens/closes the select dropdown panel, whichever is appropriate |
| open() | Opens the select dropdown panel |
| close() | Closes the select dropdown panel |
| selectItem(item) | Selects the passed item |

### Other

| Name  | Type | Description |
| ------------- | ------------- | ------------- |
| [mfOptionHighlight] | directive | Highlights search term in option. Accepts search term. Should be used on option element when customizing template |


## Change Detection
Ng-select component implements `OnPush` change detection which means the dirty checking checks for immutable
data types. That means if you do object mutations like:

```js
this.items.push({id: 1, name: 'New item'})
```

Component will not detect a change. Instead you need to do:

```js
this.items = [...this.items, { id: 1, name: 'New item' }];
```

This will cause the component to detect the change and update. Some might have concerns that
this is a pricey operation, however, it is much more performant than running `ngDoCheck` and
constantly diffing the array.

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Adam Keenan](mailto:adam.keenan@myfarms.com)
