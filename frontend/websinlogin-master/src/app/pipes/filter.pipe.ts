import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(item: any[], searchText: string): any {
    let cadena:string='';
    let expRegular = /^[a-zA-Z ]*$/;
    if(item == undefined) return;
    return item.filter(i=>{
      cadena='';
      i.forEach(element => {
        if(!expRegular.test(element)||element == null){
          cadena = cadena + element;
        }else{
          cadena = cadena+element.toLowerCase();  
        }
      });
      return cadena.includes(expRegular.test(searchText)?searchText.toLowerCase():searchText);
    });
    

  }

}
