import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { torneo } from '../model/torneo';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class TorneosService {
  private url:string
  private tiposUrl:string
  private estadosUrl:string
  constructor(private http: HttpClient,
    private _loginService:LoginService) {
    this.url = environment.url + '/torneos/'
    this.tiposUrl = environment.url + '/tipoTorneo/'
    this.estadosUrl = environment.url + '/estadoTorneo/'
   }

  getAll(relations:string[] = null,select:string[] = null){
    const relationsString = JSON.stringify(relations);
    const selectString = JSON.stringify(select);
    return this.http.get<torneo[]>(this.url+`?relations=${relationsString}&select=${selectString}`)  
  }


  get(id:string,relations:string[] = null,select:string[] = null){
    const relationsString = JSON.stringify(relations);
    const selectString = JSON.stringify(select);
    return this.http.get<torneo>(this.url+`${id}?relations=${relationsString}&select=${selectString}`)  
  }

  getEstados(){
    return this.http.get(this.estadosUrl)
  }

  save(torneo:torneo){
    return this.http.post(this.url,torneo);
  }

  edit(torneo:torneo){
    return this.http.put(`${this.url}${torneo.idTorneo}`,torneo);
  }
  
  getTipos(){
    return this.http.get(this.tiposUrl)
  }

  inscribirse(id:number){
    return this.http.post(`${this.url}/inscribir/${id}`,{})
  }
}
