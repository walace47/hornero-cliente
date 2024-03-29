import { Injectable } from '@angular/core';
import { Problema } from '../../../model/Problema';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProblemaService {

  private url:string
  constructor(private http: HttpClient) {
    this.url = environment.url + '/problema/'
   }

  getAll(relations:string[] = null,select:string[] = null){
    const relationsString = JSON.stringify(relations);
    const selectString = JSON.stringify(select);
    return this.http.get<Problema[]>(this.url+`?relations=${relationsString}&select=${selectString}`)  
  }


  get(id:string,relations:string[] = null,select:string[] = null){
    const relationsString = JSON.stringify(relations);
    const selectString = JSON.stringify(select);
    return this.http.get<Problema>(this.url+`${id}?relations=${relationsString}&select=${selectString}`)  
  }
  editar(problema:Problema){
    return this.http.put(`${this.url}/${problema.idProblema}`,problema)
  }

  crear(problema:Problema){
    console.log("El problema que se va a crear es " + problema);
    return this.http.post(this.url,problema).toPromise();
  }

}
