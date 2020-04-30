import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { PaginasComponent } from './componentes/mojo/paginas.component';

const routes: Routes = [
{ path:'mojo',
  component:PaginasComponent,
  children:[
    {path:'ingresos',loadChildren:'./componentes/mojo/ingresos/ingresos-module/ingresos.module#IngresosModule'},
    ]
},

{path:'',redirectTo:'/mojo/ingresos',pathMatch:'full'},
{path:'**',redirectTo:'/mojo//ingresos',pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
