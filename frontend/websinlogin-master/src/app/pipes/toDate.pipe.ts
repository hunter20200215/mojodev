import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'toDate'
})
export class ToDatePipe implements PipeTransform {

  transform(value: any, args?: string): any {
    if(value == null){
      return null;
    }
    if(value.length === 7){
      return moment(value).format('MM/YYYY');
    }
    return moment(moment(value).format()).format('MM/YYYY');
  }

}
