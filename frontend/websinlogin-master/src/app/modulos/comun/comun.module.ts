import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { SearchPipe } from '../../pipes/search.pipe';
import { LoadingComponent } from '../../componentes/loading/loading.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteComponent } from '../../elementos/autocomplete/autocomplete.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { FilterPipe } from '../../pipes/filter.pipe';
import { ChartsModule } from 'ng2-charts';
import {  ReplacePipe } from '../../pipes/replace.pipe';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { NgxBootstrapModule } from '../ngx-bootstrap/ngx-bootstrap.module';
import { ToDatePipe } from '../../pipes/toDate.pipe';
import { FilterEgresoPipe } from '../../pipes/filterEgresos.pipe';
import { NuevoDatatableComponent } from '../../elementos/nuevo-datatable/nuevo-datatable.component';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { DatepickerComponent } from 'src/app/elementos/datepicker/datepicker.component';
import { DatepickerLongComponent } from '../../elementos/datepicker-long/datepicker-long.component';

@NgModule({
  declarations: [
    SearchPipe,
    FilterPipe,
    ReplacePipe,
    ToDatePipe,
    LoadingComponent,
    AutocompleteComponent,
    FilterEgresoPipe,
    CurrencyPipe,
    NuevoDatatableComponent,
    DatepickerComponent,
    DatepickerLongComponent 
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxPaginationModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.circleSwish,
      backdropBackgroundColour: 'rgba(4,0,0,0.67)', 
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff', 
      secondaryColour: '#ffffff', 
      tertiaryColour: '#ffffff'
    }),
    ChartsModule,
    AngularMaterialModule,
    NgxBootstrapModule,
  ],
  exports:[
    RouterModule,
    NgxLoadingModule,
    NgSelectModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AngularMaterialModule,
    NgxBootstrapModule,
    NgbModule,
    SearchPipe,
    FilterPipe,
    ToDatePipe,
    ReplacePipe,
    CurrencyPipe,
    LoadingComponent,
    AutocompleteComponent,
    FilterEgresoPipe,
    NuevoDatatableComponent,
    DatepickerComponent,
    DatepickerLongComponent

  ],
  providers:[
  ]
})
export class ComunModule { }
