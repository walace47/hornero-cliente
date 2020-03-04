import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { stub } from '../model/stub';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StubsService {

  private url:string
  constructor(private http: HttpClient) {
    this.url = environment.url + '/stub/'
   }

  getAll(relations:string[] = null,select:string[] = null){
    const relationsString = JSON.stringify(relations);
    const selectString = JSON.stringify(select);
    return this.http.get<stub[]>(this.url+`?relations=${relationsString}&select=${selectString}`)  
  }


  get(id:string,relations:string[] = null,select:string[] = null){
    const relationsString = JSON.stringify(relations);
    const selectString = JSON.stringify(select);
    return this.http.get<stub>(this.url+`${id}?relations=${relationsString}&select=${selectString}`)  
  }

  descargar(archivo:string):Observable<any>{
    return this.http.get(this.url+`descargar?archivo=${archivo}`, { responseType: 'blob' });
  }

}
