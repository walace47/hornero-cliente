import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { Solucion } from 'src/app/model/Solucion';

@Component({
    selector: 'app-resoluciones',
    templateUrl: './resoluciones.component.html'
})
export class ResolucionesComponent implements OnInit {
    @ViewChild('up') fileUpload: FileUpload;
    CSV_INTRUCTIONS :string = 'Acepta archivos CSV separado por ; por ejemplo para el problema de la suma  primer columna parametros de entrada: Pueden ser varios elementos separados por , segunda columna respuesta esperada del algoritmo, por ejemplo para el algoritmo de la suma una fila correcta seria "1,2;3" '
    modoEdicion: boolean = false;
    soluciones: Solucion[] = [];
    @Input("soluciones")
    set solucionesInput(soluciones: Solucion[]) {
        this.modoEdicion = true;
        this.soluciones = soluciones;
    };
    @Output() solucionesEmiter = new EventEmitter();
    nombreArchivo: string = "Cargar archivo csv";
    constructor() { }

    ngOnInit(): void {

    }
    borrarSolucion(index:number){
        this.soluciones = this.soluciones.filter((e,i) => i != index)
        this.solucionesEmiter.emit(this.soluciones);

    }

    agregarSolucion() {
        if (!this.soluciones) this.soluciones = []
        this.soluciones.unshift({
            parametrosEntrada: "0",
            salida: "0"
        })
    }

    eliminarUltimaCelda() {
        this.soluciones.pop()
    }


    cargarCSV(event) {
        let archivo:File = event.files[0]
        let reader = new FileReader();
        this.nombreArchivo = archivo.name;
        reader.readAsText(archivo)
        reader.onload = () => {
            let csvData = reader.result
            let csvRecordArray = (<string>csvData).split(/\r\n|\n/);
            csvRecordArray.forEach(e => {
                const par = e.split(";");
                if(par.length == 2){
                    this.soluciones.unshift({
                        parametrosEntrada: par[0],
                        salida: par[1]
                    })
                }
            })
            this.fileUpload.clear();
            this.solucionesEmiter.emit(this.soluciones);
        }
    }

    emitirSoluciones() {
        this.solucionesEmiter.emit(this.soluciones);

    }

    isValidCSVFile(file: any) {
        return file.name.endsWith(".csv");
    }
}
