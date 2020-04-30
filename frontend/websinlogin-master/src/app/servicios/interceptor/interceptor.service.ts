import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpResponse, HttpEvent, HttpHandler,HttpRequest } from '@angular/common/http';
import { Observable} from 'rxjs';
import { tap } from 'rxjs/operators';
import { Constante } from 'src/app/utilidades/constante';


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
  request =  request.clone({
      headers: request.headers.set("Content-Type", "application/json")
    });

 

  /*request = request.clone({
    headers: request.headers.set("Authorization", `yesica`)
  });*/


  return next.handle(request).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
          }
        },
        error => {
          if (event instanceof HttpResponse) {
            console.log(event);
          }
        }
      )
    );
  }
}
