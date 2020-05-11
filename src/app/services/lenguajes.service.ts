import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Lenguaje } from '../model/Lenguaje';
@Injectable({
  providedIn: 'root'
})
export class LenguajesService {
  private url:string
  constructor(private http: HttpClient) {
    this.url = environment.url + '/lenguajes/'
   }

  getAll(relations:string[] = null,select:string[] = null){
    const relationsString = JSON.stringify(relations);
    const selectString = JSON.stringify(select);
    return this.http.get<Lenguaje[]>(this.url+`?relations=${relationsString}&select=${selectString}`);
  }
  get(id:string,relations:string[] = null,select:string[] = null){
    const relationsString = JSON.stringify(relations);
    const selectString = JSON.stringify(select);
    return this.http.get<Lenguaje[]>(this.url+`${id}?relations=${relationsString}&select=${selectString}`)
  }
}
