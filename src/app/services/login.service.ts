import { Injectable } from "@angular/core";
import { UsuarioConectado } from '../model/usuario';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: "root"
})
export class LoginService {
  private url:string;
  private display:boolean;
  constructor(private http:HttpClient) {
    this.url = environment.url + "/login";
    this.display = false;
  }

  getToken(){
      const usuario:UsuarioConectado = JSON.parse(localStorage.getItem("usuario"));
      return usuario;
  }
  mostrarLogin(){
    return this.display;
  }
  setDisplay(nuevoEstado:boolean){
    this.display = nuevoEstado;
  }

  isLogin() {
    const usuario:UsuarioConectado = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return false;
    if (usuario.fechaFin < (new Date()) ) return false
    return true;
  }

  login(usuario:string,pass:string){
    return this.http.post(this.url,{usuario,pass})
  }

  logout(){
    localStorage.removeItem("usuario");
  }

}
