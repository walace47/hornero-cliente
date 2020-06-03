import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CodigoUsuario } from '../model/CodigoUsuario';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CodigoUsuarioService {
  private url: string;

  constructor(private http:HttpClient) {
    this.url = environment.url + '/codigo/';
   }

  save(nuevoCodigo:CodigoUsuario){
    return this.http.post(this.url,nuevoCodigo).toPromise()
  }
  getAll() {
    return this.http.get<CodigoUsuario[]>(this.url).toPromise();
  }

}
