import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';

import { PaginasComponent } from './componentes/mojo/paginas.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FooterComponent } from './componentes/footer/footer.component';
import { InterceptorService } from './servicios/interceptor/interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatPaginatorIntl, MatPaginator} from '@angular/material';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntlEses } from './servicios/ES-es.paginator';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PaginasComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.circleSwish,
      backdropBackgroundColour: 'rgba(4,0,0,0.67)',
      backdropBorderRadius: '4px',
      primaryColour: '#f4da30',
      secondaryColour: '#f4da30',
      tertiaryColour: '#f4da30',
      fullScreenBackdrop:true
    }),
    SweetAlert2Module,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true
  },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlEses },
     { provide: MAT_DATE_LOCALE, useValue: 'es' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
