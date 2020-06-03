import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Complejidad } from '../model/Complejidad';

@Injectable({
  providedIn: 'root'
})
export class ComplejidadService {
  private url: string;

  constructor(private http:HttpClient) {
    this.url = environment.url + '/complejidad/';

   }

  getAll() {
    return this.http.get<Complejidad[]>(this.url).toPromise();
  }

}
