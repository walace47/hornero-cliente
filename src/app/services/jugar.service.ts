import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {EntradaJuego,RespuestaJuego} from "../model/Jugar"
import { Resolucion } from '../model/Resolucion';

@Injectable({
  providedIn: 'root'
})
export class JugarService {
  private url: string;

  constructor(private http:HttpClient) {
    this.url = environment.url + '/jugar';

   }

  async obtenerParametrosEntrada(numeroProblema:number,tokenJugador:string){
    console.log(`${this.url}/solicitud?problema=${numeroProblema}&token=${tokenJugador}`)
    return this.http
      .get<EntradaJuego>(`${this.url}/solicitud?problema=${numeroProblema}&token=${tokenJugador}`)
      .toPromise();
  }

  async enviarRespuesta(respuesta:RespuestaJuego){
    return this.http
      .get<any>(`${this.url}/respuesta?solucion=${respuesta.respuesta}&tokenSolicitud=${respuesta.token}`)
      .toPromise();
    }

}
