import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: any): any {
    return value.replace('-','/').replace('-','/').substring(0, 10);
  }

}
