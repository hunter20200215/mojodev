import { Injectable } from '@angular/core';
import Swal from "sweetalert2";
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  swal: any
  constructor() {
    this.swal = Swal.mixin({
      showConfirmButton: false,
      timer: 5000,
      background: '#161616',
      customClass: {
        title: 'color-text ',
        content: 'color-text',
      }
    });
  }


  success(message: string) {
    this.swal.fire({
      type: 'success',
      background: 'black',
      title: 'OK!!',
      text: message
    })
  }

  error(message: string) {
    this.swal.fire({
      type: 'error',
      background: 'black',
      title: 'Error!!',
      text: message
    })
  }

  info(message: string) {
    this.swal.fire({
      type: 'info',
      background: 'black',
      title: 'Info!!',
      text: message,
      padding:6
    });
  }

  delete(){
   return from(Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      background: 'white',
      showCancelButton: true,
      confirmButtonColor: '#edd920',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Si,seguro!'
    }));
    
    /*.then((result) => {
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })*/
  }

  deleteSuccess(){
    Swal.fire(
      'Eliminado!',
      'Operación realizada correctamente',
      'success'
    )
  }

}
