import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { empty, observable, Observable, Subject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {

  refreshingAccessToken:boolean | undefined;

  accessTokenRefreshed:Subject<any>=new Subject();

  constructor(private authService:AuthService) { }

  intercept(request:HttpRequest<any>,next:HttpHandler):Observable<any>{
    request=this.addAuthHeader(request);

    //call next()and handle the response
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse)=> {

        console.log(error);

        if(error.status===401 ){
          //401 error so we are unathorized

          //refresh the access token
         return  this.refreshAccessToken()
          .pipe(
            switchMap(()=>{
              request=this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((err:any)=>{
              console.log(err);
              this.authService.logout();
              return empty();
            })
          )


         
          this.authService.logout();
        }

        return throwError(error);
      })
    )

    }

    refreshAccessToken(){
      if(this.refreshingAccessToken){
        return new Observable(observer=>{
          this.accessTokenRefreshed.subscribe(()=>{
            observer.next();
            observer.complete();
          })
        })

      }else{
        this.refreshingAccessToken=true;
      //we want to call a method in the auth service to send a request to refresh the access token
      return this.authService.getNewAccessToken().pipe(
        tap(()=>{
          this.refreshingAccessToken=false;
          console.log("access Token Refreshed");
          this.accessTokenRefreshed.next();
        })
      )

      }
      
    }

  addAuthHeader(request:HttpRequest<any>){
    const token=this.authService.getAccessToken();

    if(token){
      return request.clone({
        setHeaders:{
          'x-access-token':token
        }
      })
    }
    return request;
  }
}
