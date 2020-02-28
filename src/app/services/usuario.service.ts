import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { usuario } from '../model/usuario';
import { FormControl } from '@angular/forms';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url:string
  debouncer: any;

  constructor(private http: HttpClient) {
    this.url = environment.url + '/usuarios'
   }

  getAll(select?:string){
    console.log(select)
    return this.http.get<usuario[]>(this.url+`/todos?select=${select}`);
  }
  get(id:string,select?:string,relations?:string){
    return this.http.get(this.url+`/${id}?relations=${relations}`)
  }

  existeUsuario(nombreUsuario:string){
    return this.http.post(this.url+`/nombreRegistrado`,{username:nombreUsuario})

  }

  save(usuario:usuario){
    return this.http.post(this.url,usuario);
  }

  existeEmail(email:string){
    return this.http.post(this.url+`/emailRegistrado`,{email:email})
  }

}
