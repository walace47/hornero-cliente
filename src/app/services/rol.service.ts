import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { rol } from '../model/rol';


@Injectable({
  providedIn: 'root'
})
export class RolService {

  private url:string
  constructor(private http: HttpClient) {
    this.url = environment.url + '/rol/'
   }

  getAll(relations:string[] = null,select:string[] = null){
    const relationsString = JSON.stringify(relations);
    const selectString = JSON.stringify(select);
    return this.http.get<rol[]>(this.url+`?relations=${relationsString}&select=${selectString}`)  
  }


  get(id:string,relations:string[] = null,select:string[] = null){
    const relationsString = JSON.stringify(relations);
    const selectString = JSON.stringify(select);
    return this.http.get<rol>(this.url+`${id}?relations=${relationsString}&select=${selectString}`)  
  }

}
