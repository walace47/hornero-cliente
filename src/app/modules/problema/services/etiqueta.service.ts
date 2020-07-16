import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Etiqueta } from '../../../model/Etiqueta';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EtiquetasService {
  private url: string;

  constructor(private http:HttpClient) {
    this.url = environment.url + '/etiqueta/';

  }

  getAll() {
    return this.http.get<Etiqueta[]>(this.url).toPromise();
  }
}
