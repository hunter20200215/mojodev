import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChange, SimpleChanges, ɵConsole } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { startWith, delay, tap, switchMap, catchError, map } from 'rxjs/operators';
import { AlertService } from '../../servicios/alert/alert.service';
import { IngresosService } from '../../servicios/mojo/ingresos/ingresos.service';

@Component({
  selector: 'app-nuevo-datatable',
  templateUrl: './nuevo-datatable.component.html',
  styleUrls: ['./nuevo-datatable.component.css']
})
export class NuevoDatatableComponent implements OnInit,OnChanges {

  @Input() config;
  @Input() filtro;
  @Input() columnsDisplay;
  loadingTable:boolean;
  filter$ = new BehaviorSubject(null);
  columnsTable:any[]=[];
  length:number;
  show:boolean;
  dataSource: MatTableDataSource<any> =  new MatTableDataSource<any>();
  @ViewChild('paginatorPrincipal') paginator: MatPaginator;

  constructor(private _message:AlertService,
              private _ingresosService:IngresosService) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.show = false;
    const config:SimpleChange = changes.config;
    const filtro:SimpleChange = changes.filtro;
    this.columnsTable =[];
    if(config){
      this.config = config.currentValue;
    }
    if(filtro){
      this.filtro = filtro.currentValue;
    }
    this.columnsDisplay.map(x=>{
      this.columnsTable.push(x.responseName);
    })
    this.filter$.next(null);
      
  }


  ngOnInit() {
    this.initTable();
  }

  applyFilter(value:string){
    this.filter$.next(value);
  }

  initTable(){
    combineLatest(
      this.paginator.page.pipe(startWith(1)),
      this.filter$
    ).pipe(
     delay(0),
     tap(([s1,s2])=>{
       this.loadingTable = true;
     }),
     map(([paginator,busqueda])=>[{ pageIndex: this.paginator.pageIndex+1, pageSize: this.paginator.pageSize },busqueda]),
     switchMap(([paginator,busqueda])=>{
       const _paginator = (paginator as PageEvent);
       const peticion ={
          cantidad:_paginator.pageSize,
          pagina:_paginator.pageIndex,
          busqueda:(busqueda==null)?'':busqueda
       };
       return this._ingresosService.getDetalle(this.filtro,this.config,peticion).pipe(
         catchError((err)=>{
           this._message.error("Error consultando el detalle de los ingresos"); return of([]);
         })
       );
     }) 
    ).subscribe(
      (result:any)=>{
        this.dataSource.data = result.data;
        this.length = result.count>0?result.count:0;
        this.loadingTable = false;
        this.show= true;

      }
    );
  }

}
