import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Operacion } from '../../../utilidades/operacion';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map, mergeMap } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable()
export class IngresosService {

  constructor(private _http: HttpClient) {


  }

  resolve(){
    return this.getRangoPeriodo();
  }

  /** ------Servicios de ingresos  definitivos------------  */
  public getComboFilter(filtro:any):Observable<HttpResponse<any>>{
    let url:string = `${Operacion.URLCOMBOFILTER}search=${filtro.value}&comboValue=${filtro.comboValue}`;
    return this._http.post(url,filtro.filtroObject,{observe:'response'});
  }

  public getDetalleCuentaAfiliado(filtro:any):Observable<HttpResponse<any>>{
    let url:string = `${Operacion.URLDETALLECUENTA}`;
    return this._http.post(url,filtro,{observe:'response'});
  }

  public getComparativaIngresos(filtro:any):Observable<HttpResponse<any>>{
    let url:string = `${Operacion.URLCOMPARATIVA}tipo=${filtro.canal}`;
    return this._http.post(url,filtro,{observe:'response'});
  }

  public getDetalle(filtro:any,vista:string,paginado:any):Observable<HttpResponse<any>>{
    let url:string = `${Operacion.URLDETALLE}vista=${vista}&pagina=${paginado.pagina}&cantidad=${paginado.cantidad}&busqueda=${paginado.busqueda}`;
    return this._http.post(url,filtro,{observe:'response'}).pipe(
      map((res:any)=>{
        return res.body.result;
      })
    );
  }

  public getRangoPeriodo():Observable<any>{
    return this._http.get(`${Operacion.URLPERIODO}`,{observe:'response'}).pipe(
      map((x:any)=>{
        return x.body.result;
      }),
      mergeMap((result:any)=>{
        // aca setear el periodo de query inicial
        let Q = new Date(moment(result[0].fechaHasta).format());
        Q.setMonth(Q.getMonth() -2);
        let fechaInicioRango = Q;
        let filtro = {
          filtroObject:{
            filtro:[],
            periodo:{
              fechaInicio:moment(Q).format("YYYY-MM-DD"),
              fechaFin: moment(result[0].fechaHasta).format("YYYY-MM-DD")
            }
          }
        }
       return  this.getMultiplePeticiones(filtro,"","","").pipe(
         map((res:any)=>{
           let obj = {
             periodo: result,
             detalle: res
           }
           return obj;
         })
       )
      })
    );
  }


  public getMultiplePeticiones(filtro:any,tipo:string,vista:string,paginado:any):Observable<any>{

    let urlDetalleCuenta:string = `${Operacion.URLDETALLECUENTA}`;
    const reqDetalleCuenta = this._http.post(urlDetalleCuenta,filtro,{observe:'response'});

    let urlComparativa:string = `${Operacion.URLCOMPARATIVA}tipo=canal`;
    const reqComparativa = this._http.post(urlComparativa,filtro,{observe:'response'});
    
    const requestArray = [];
    
    //if(filtro.filtroObject.filtro.length == 0){
      requestArray.push(reqDetalleCuenta);
    //}
    requestArray.push(reqComparativa);
    return forkJoin(requestArray).pipe(
      map((res:any)=>{
        let datos:any[]=[];
        res.map(x=>{
          datos.push(x.body.result);
        })
        return datos;
      })
    );
  }

  /*------------------------------------------------------- */
}
