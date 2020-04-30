import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IngresosComponent } from '../ingresos.component';
import { IngresosService } from '../../../../servicios/mojo/ingresos/ingresos.service';

const routes: Routes = [
  {path:'', component:IngresosComponent,resolve:{data:IngresosService} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresosRoutingModule { }
