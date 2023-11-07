import { Component, OnInit, OnDestroy } from '@angular/core';
import { StubsService } from '../../services/stubs.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { Stub } from 'src/app/model/Stub';
import * as fileSaver from 'file-saver';
@Component({
    selector: 'app-stubs',
    templateUrl: './stubs.component.html',
    providers: [StubsService],
    styleUrls: ['./stubs.component.css']

})
export class StubsComponent implements OnInit, OnDestroy {
    private suscripciones: Subscription[] = [];
    public stubs: Stub[];
    public loading: boolean = true;

    constructor(
        private _stubService: StubsService) { }

    ngOnInit(): void {

        firstValueFrom(this._stubService.getAll(["lenguaje"]))
            .then((stubs: Stub[]) => {this.stubs = stubs; console.log(stubs)} )
            .catch(e => console.log(e))


    }
    getStubs(){
        return this._stubService.getAll(["lenguaje"])
    }
    ngOnDestroy() {
        this.suscripciones.forEach(sub => sub.unsubscribe())
    }

    download(nombreArchivo: string) {
        console.log(nombreArchivo)
        this._stubService.descargar(nombreArchivo).subscribe((archivo) => {
            let blob: any = new Blob([archivo]);
            fileSaver.saveAs(blob, nombreArchivo)
        })
    }

}
