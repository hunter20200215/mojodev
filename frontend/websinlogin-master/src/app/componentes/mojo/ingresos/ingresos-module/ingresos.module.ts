import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngresosRoutingModule } from './ingresos.routing.module';
import { IngresosComponent } from '../ingresos.component';
import { ComunModule } from '../../../../modulos/comun/comun.module';
import { IngresoDetailComponent } from '../ingreso-detail/ingreso-detail.component';
import { AngularMaterialModule } from '../../../../modulos/angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IngresosService } from '../../../../servicios/mojo/ingresos/ingresos.service';



@NgModule({
  declarations: [IngresosComponent, IngresoDetailComponent],
  imports: [
    CommonModule,
    ComunModule,
    IngresosRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule
    
  ],
  providers:[
    IngresosService
  ]
})
export class IngresosModule { }
