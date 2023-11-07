import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ArchivoService {

    private url: string;
    private publicUrl: string;

    constructor(private http: HttpClient) {
        this.url = environment.url + '/archivo/';
        this.publicUrl = environment.url + "/problemas"

    }
    obtenerArchivo(nombre: string) {
        return firstValueFrom(this.http.get(`${this.publicUrl}/${nombre}`,{
            responseType:'blob'
        }))
    }

    subirArchivo(tipo: string, nombre: string, file: File) {
        const HttpUploadOptions = {
            headers: new HttpHeaders({ "Accept": "application/json" })
        }
        let input = new FormData();
        input.append("tipo", tipo);
        input.append("nombre", nombre);
        console.log(input.getAll("nombre"))
        input.append("file", file);
        console.log(input.getAll("file"))
        return firstValueFrom(this.http.post(this.url, input, HttpUploadOptions));
    }

}
