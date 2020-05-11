import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Usuario, UsuarioConectado } from '../model/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url:string
  debouncer: any;

  constructor(private http: HttpClient) {
    this.url = environment.url + '/usuarios'
   }

  getAll(select:string[] = null,relations:string[] = null){
    const relationsString = JSON.stringify(relations);
    const selectString = JSON.stringify(select);
    return this.http.get<Usuario[]>(this.url+`/?select=${selectString}&relations=${relationsString}`);
  }
  get(id:string,select:string = null,relations:string = null){
    return this.http.get(this.url+`/${id}?relations=${relations}`)
  }

  existeUsuario(nombreUsuario:string){
    return this.http.post(this.url+`/nombreRegistrado`,{username:nombreUsuario})

  }

  save(usuario:Usuario){
    return this.http.post(this.url,usuario);
  }

  existeEmail(email:string){
    return this.http.post(this.url+`/emailRegistrado`,{email:email})
  }

  async getTorneos(){
    const usuario:UsuarioConectado = JSON.parse(localStorage.getItem("usuario"));
    if(!usuario) return []
    const relations = JSON.stringify(['rol','torneosUsuarios','torneosUsuarios.torneo','torneosUsuarios.torneo.estado']);
    usuario.usuario = await this.get(usuario.usuario.idUsuario.toString(),null,relations).toPromise()
    console.log(usuario.usuario)
    return usuario.usuario.torneosUsuarios;
    
  }

  isAdmin(){
    
  }

}
