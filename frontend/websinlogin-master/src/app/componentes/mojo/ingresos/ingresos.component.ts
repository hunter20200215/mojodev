import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { BsDatepickerConfig, BsDatepickerViewMode, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { AlertService } from '../../../servicios/alert/alert.service';
import { FormGroup, FormBuilder, FormControl,Validators, FormArray } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize, startWith, delay, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { Mensaje } from '../../../utilidades/mensaje';
import { IngresosService } from '../../../servicios/mojo/ingresos/ingresos.service';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { datos} from './ingresosTable';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { MatTableDataSource, MatPaginator } from '@angular/material';


@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent implements OnInit {


  @ViewChild('paginatorPrincipal') paginator: MatPaginator;

  public lineChartData: ChartDataSets[] = [
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions= {
    responsive: true,
  }; 
  public lineChartColors: Color[] = [{borderColor:'#70d962',backgroundColor:'transparent'},{borderColor:'#e93f33',backgroundColor:'transparent'}

  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  
  //Variables table
  loadingTable:boolean;
  filter$ = new BehaviorSubject(null);
  columnsTable:any = [];
  length:number;
  showTable:boolean;
  dataSource: MatTableDataSource<any> =  new MatTableDataSource<any>();
  columnsDisplay:any=datos["album"];
  
  //Variables definitivas usadas
  show:boolean;
  filters: any[] = [];
  loading: boolean;
  showDetalle:boolean = true;
  isLoading = false;
  isLoading2 = false;
  objectSelect: FormGroup;
  objectFiltrados: any[] = [];
  datosDetalle:any;
  filtroTabla:string="album";
  minDate:Date = null;
  maxDate:Date = null;
  filtroEnviar:FormGroup = null;
  minMode: BsDatepickerViewMode = 'month';
  bsConfig: Partial<BsDatepickerConfig>;
  filtro:any[] = [
    { id: 'sello', nombre: 'Sello' },
    { id: 'album', nombre: 'Album' },
    { id: 'artista', nombre: 'Artista' },
    { id: 'track', nombre: 'Track' },
    { id: 'servicio', nombre: 'Servicio' },    
    { id: 'pais', nombre: 'País' },
   
  ];
  filtroCombo:any[] = this.filtro;

  fechaInicio:Date;
  fechaFin:Date;

  constructor(  private _route:ActivatedRoute,
                private _http: HttpClient,
                private _message:AlertService,
                private _fb: FormBuilder,
                private _ingresoService:IngresosService,
                private localeService: BsLocaleService,
                private changeDectector:ChangeDetectorRef
            ) {
                defineLocale('es', esLocale);


              }


  ngOnInit() {


    this.localeService.use('es');
    this.filtroEnviar =this._fb.group({
      filtroObject:this._fb.group({
        periodo : this._fb.group({
           fechaInicio:['',Validators.required],
           fechaFin:['']
       }),
        filtro: this._fb.array([
  
        ])
      })
    });

    this.objectSelect = this._fb.group({
      tipo: [''],
      valor: ['']
    });


    this.filtroEnviar.controls["filtroObject"].get("periodo")
                                              .get("fechaInicio")
                                              .setValidators([Validators.required,this.esMayor.bind(this.filtroEnviar)])


    

    this.filtroEnviar.controls["filtroObject"].get("periodo")
                                              .get("fechaFin")
                                              .setValidators([Validators.required,this.esMayor.bind(this.filtroEnviar)])



                                            
    this.bsConfig = Object.assign({}, {
        minMode: this.minMode,
        dateInputFormat: 'MM/YYYY'
    });
    
    this.loadingAuto();
    this.obtenerFechas();
    this.setearData();
  }
  
  verMasDetalles(){
    this.showTable = true;
    this.changeDectector.detectChanges();
    this.initTable();
  }
  
  obtenerFechas(){
    this.loading = true;
    this._route.data.subscribe((res:any)=>{
      this.asignarData(res.data.detalle);
      this.minDate = new Date(moment(res.data.periodo[0].fechaDesde).format());
      this.maxDate = new Date(moment(res.data.periodo[0].fechaHasta).format());
     
     
      let Q = new Date(moment(res.data.periodo[0].fechaHasta).format());

      Q.setMonth(Q.getMonth() -2);


      this.filtroEnviar.controls['filtroObject'].get('periodo')
                                                .get('fechaInicio')
                                                .setValue(Q);
      this.filtroEnviar.controls['filtroObject'].get('periodo')
                                                .get('fechaFin')
                                                .setValue(this.maxDate);
                                            
      this.fechaInicio = Q;
      this.fechaFin = this.maxDate;
      this.loading = false;

    },error=>{
      this._message.error(Mensaje.noBackEnd);
    });
  }



  esMayor(control:FormControl){
    let forma:any = this;  
    if(forma.controls['filtroObject'].controls['periodo'].controls['fechaInicio'].value > control.value ){
        return{
          esmayor:true
        };
      }
      return null;
  }
  


  obtenerData(){
    
    if(this.paginator)
      this.paginator.firstPage();
    
    this.loading = true;
    this.fechaInicio = this.filtroEnviar.controls['filtroObject'].get('periodo')
                                                             .get('fechaInicio').value;

    this.fechaFin = this.filtroEnviar.controls['filtroObject'].get('periodo')
                                                             .get('fechaFin').value;

    this._ingresoService.getMultiplePeticiones(this.filtroEnviar.value,null,this.filtroTabla,{pagina:1,cantidad:10,busqueda:null}).subscribe(
      (res:any)=>{
        this.asignarData(res);
        if(this.paginator){
          this.initTable();
        }else{
          this.loading = false;
        }
      },error=>{
        this.loading  = false;
        this._message.error(Mensaje.noBackEnd)
      }
    )
  }


  
  asignarData(data:any){
    let datosDetalle:any =data[0];
    let datosGrafica:any = (data.length>1)?data[1]:data[0];
    //Se asigna datos a detalle
    if(data.length>1){
      this.setDetalle(datosDetalle);
    }
    //Se asigna datos a grafico
    this.setDataChart(datosGrafica);
    //Se asigna datos a dataTable
    this.showDetalle = (this.filters.length > 0)?false:true;
    this.show = true;
  }

 consultarTabla(campo:string){
   this.loading = true;
   this.dataSource.data = [];
   this.columnsTable =[];
   this.filtroTabla = campo;
   this.columnsDisplay = datos[campo];
   this.columnsDisplay.map(x=>{
    this.columnsTable.push(x.responseName);
  });

   this.paginator.firstPage();
   this.initTable();


 }

 setearData(){
    this.columnsDisplay = datos["album"];
    this.columnsDisplay.map(x=>{
      this.columnsTable.push(x.responseName);
    });
 }

 setDataChart(data:any){
  this.lineChartLabels =data.periodo;
  this.lineChartLabels.unshift("0");
  this.lineChartData =  data.datosChart;
  this.lineChartData.map((x:any)=>{
      x.data.unshift(0);
      return x;
    });
  data.datosChart.map(x=>{
    this.lineChartColors.push({borderColor:x.borderColor,backgroundColor:x.backgroundColor});
  });
  
 }

 setDetalle(data:any){
      let pagos:number=0;
      let anticipo:number=0;
      let saldo:number=0;
      if(this.filters.length == 0){
        data.pagos.forEach(x=>{
            pagos += x.monto;
        })
        data.anticipos.forEach(x=>{
          anticipo += x.monto;
        });
  
        saldo = data.ingresos-anticipo-pagos;
        this.datosDetalle = {
          data,
          saldo:saldo
        };
      }else{
        this.datosDetalle ={
          data:{
            ingresos:data.ingresos,
            pagos:[],
            anticipos:[]
          },
          saldo:null
        }
      }
        
 } 
  
  ////-------------------------------------------///

  onChangePor(event: any) {
    this.filters.push(this.objectSelect.value);
    (<FormArray>this.filtroEnviar.controls['filtroObject'].get('filtro')).push(
      new FormControl(this.objectSelect.value)
    );
    this.filtroCombo = this.filtroCombo.filter(x=>{
      if(this.objectSelect.value.tipo != x.id){
        return x;
      }
    });

    this.objectSelect.reset();
  }

  remove(filter) {
    this.filtroCombo.push(this.filtro.find(x=>x.id == filter.tipo));
    const index = this.filters.indexOf(filter);
    if (index >= 0) {
      this.filters.splice(index, 1);
      (<FormArray>this.filtroEnviar.controls['filtroObject'].get('filtro')).removeAt(index);
    }


  }

  loadingAuto() {
    this.objectSelect.controls['valor'].valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.objectFiltrados = [];
          this.isLoading2 = true;
          
        }),
        switchMap(value => this._http.post(`https://tsyxcs4qll.execute-api.us-east-1.amazonaws.com/dev/comboFilter?search=${value}&comboValue=${this.objectSelect.controls['tipo'].value}`,this.filtroEnviar.value)
          .pipe(
            finalize(() => {
              this.isLoading2 = false
            }),
          )
        )
      )
      .subscribe((data:any) => {
        if (data.result == undefined) {
          this.objectFiltrados = [];
        }else{
          this.objectFiltrados = data.result;

        }
      },error =>{
        this.objectFiltrados = [];
      });
  }

  
  pageChange(paginator:any){
    this.paginator = paginator;
    this.initTable();
  };


  initTable(){
    combineLatest(
      this.filter$
    ).pipe(
      debounceTime(100),
     tap(([s2])=>{
       this.loading = true;
     }),
     map(([busqueda])=>[,busqueda]),
     switchMap(([busqueda])=>{
       const peticion ={
          cantidad:this.paginator.pageSize,
          pagina:this.paginator.pageIndex+1,
          busqueda:(busqueda==null)?'':busqueda
       };
       return this._ingresoService.getDetalle(this.filtroEnviar.value,this.filtroTabla,peticion).pipe(
         catchError((err)=>{
           this._message.error("Error consultando el detalle de los ingresos"); return of([]);
         })
       );
     }) 
    ).subscribe(
      (result:any)=>{
        this.dataSource.data = result.data;
        this.length = result.count>0?result.count:0;
        this.loading = false;
        if(this.filters.length != 0){
          this.datosDetalle ={
            data:{
              ingresos:result.ingreso,
              pagos:[],
              anticipos:[]
            },
            saldo:null
          }
        }

      }
    );
  }






















}
