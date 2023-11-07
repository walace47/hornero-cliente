import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Etiqueta } from 'src/app/model/Etiqueta';
import { Problema } from 'src/app/model/Problema';
import { ProblemaService } from 'src/app/modules/problema/services/problema.service';

@Component({
    selector: 'app-problemas',
    templateUrl: './problemas.component.html',
    styleUrls: ['./problemas.component.css']
})
export class ProblemasComponent implements OnInit {

    public problemas: Problema[] = [];
    public problemasFilter: Problema[] = [];


    constructor(private _problemaService: ProblemaService) { }

    ngOnInit(): void {
        firstValueFrom(this._problemaService.getAll(["etiquetas"]))
            .then((problemas: Problema[]) => {
                this.problemas = problemas;
                this.problemasFilter = problemas;
            })
            .catch(error => console.error(error));
    }
    filtrar(e) {
        if (e.target.value) {
            const filtro: string = (e.target.value).toLocaleLowerCase();
            this.problemasFilter = this.problemas.filter(p => {
                let existeEtiqueta = false;
                p.etiquetas.forEach(e => {
                    existeEtiqueta = existeEtiqueta || e.etiqueta.toLocaleLowerCase().includes(filtro)
                })
                return (p.nombre.toLocaleLowerCase().includes(filtro) || existeEtiqueta)
            })
        } else {
            this.problemasFilter = this.problemas
        }
    }

    mostrarEtiquetas(etiquetas: Etiqueta[]) {
        return etiquetas.map(e => e.etiqueta).join(", ");
    }
}
