import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { usuario, UsuarioConectado } from '../model/usuario';

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
    return this.http.get<usuario[]>(this.url+`/?select=${selectString}&relations=${relationsString}`);
  }
  get(id:string,select:string = null,relations:string = null){
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

  async getTorneos(){
    const usuario:UsuarioConectado = JSON.parse(localStorage.getItem("usuario"));
    const relations = JSON.stringify(['idRol','torneousuarios','torneousuarios.idTorneo']);
    usuario.usuario = await this.get(usuario.usuario.idUsuario.toString(),null,relations).toPromise()
    return usuario.usuario.torneousuarios;
    
  }

  isAdmin(){
    
  }

}
