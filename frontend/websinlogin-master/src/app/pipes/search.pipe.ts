import { Pipe, PipeTransform } from '@angular/core';
import { Constante } from '../utilidades/constante';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(item: any[], text: string, type: string): any {
    if (type === Constante.artistaPipe) {
      return item.filter((i: any) => {
        return i.nombres.toLowerCase().includes(text.toLowerCase());
      })
    }

    if (type === Constante.albumPipe) {
      return item.filter((i: any) => {
        return i.nombre.toLowerCase().includes(text.toLowerCase());
      })
    }



  }

}
