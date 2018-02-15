import { Injectable, PipeTransform, Pipe } from '@angular/core';

/**
 * Transforms any input value
 */
@Pipe({
  name: 'mfSelectPipe'
})
@Injectable()
export class MfSelectPipe implements PipeTransform {
  transform(value: any, args: any[] = null): string {
    return value;
  }
}
