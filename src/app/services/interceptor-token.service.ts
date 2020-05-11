import {Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioConectado } from '../model/Usuario';

@Injectable({
  providedIn: 'root'
})
export class InterceptorTokenService implements HttpInterceptor {

  constructor() { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const usuario:UsuarioConectado = JSON.parse(localStorage.getItem("usuario"));
    let newHeaders = req.headers;
    let token;
    if(usuario){
      token = usuario.token
    }else{
      token ="wdasd"
    }
    newHeaders = newHeaders.append('token', token);
    const authReq = req.clone({headers: newHeaders});
    return next.handle(authReq);
  }
}
