import { Injectable } from '@angular/core';
import { IngresosService } from './ingresos.service';
import { Subject, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AccessIngresosService {

  /*------Variables definitivas---- */
  private comboFilter = new BehaviorSubject<any>(null);

  /*--------------------------------*/
  constructor(private _ingresosService: IngresosService) { }

  /*----------------Servicios definitivos--------------- */
  public getComboFilter(filtro:any){
    this._ingresosService.getComboFilter(filtro)
                         .subscribe(
                           (res:any)=>{
                            this.comboFilter.next(res);
                           },error=>{
                            this.comboFilter.next(error);
                           }                   
                         )
  };

  /*-----------------------------------------------------*/


}
 