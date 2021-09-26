import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { Stub } from '../../../model/Stub';
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
    return this.http.get<Stub[]>(this.url+`?relations=${relationsString}&select=${selectString}`)  
  }

  create(stub:Stub){
    return this.http.post<Stub>(this.url,stub);  
  }

  edit(stub:Stub){
      return this.http.put<Stub>(this.url+"/"+stub.idStubs,stub);  
  }
  
  get(id:string,relations:string[] = null,select:string[] = null){
    const relationsString = JSON.stringify(relations);
    const selectString = JSON.stringify(select);
    return this.http.get<Stub>(this.url+`${id}?relations=${relationsString}&select=${selectString}`)  
  }

  descargar(archivo:string):Observable<any>{
    return this.http.get(this.url+`descargar?archivo=${archivo}`, { responseType: 'blob' });
  }

}
