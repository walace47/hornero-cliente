import { Component, OnInit,Input, Output,EventEmitter} from '@angular/core';
import { Solucion } from 'src/app/model/Solucion';

@Component({
  selector: 'app-resoluciones',
  templateUrl: './resoluciones.component.html'
})
export class ResolucionesComponent implements OnInit {

  modoEdicion:boolean = false;
  soluciones:Solucion[] = [];
  @Input("soluciones") 
  set solucionesInput(soluciones:Solucion[]){
    this.modoEdicion = true
    this.soluciones = soluciones;
  };
  @Output() solucionesEmiter =  new EventEmitter();
  nombreArchivo:string = "Cargar archivo csv";
  constructor() { }

  ngOnInit(): void {
    if(this.soluciones?.length > 0){
      this.modoEdicion = false;
    }else{
      this.modoEdicion = true;
    }
  }

  agregarSolucion(){
    this.soluciones.push({
      parametrosEntrada:"0",
      salida:"0"
    })
  }

  eliminarUltimaCelda(){
    this.soluciones.pop()
  }


  //Carga el archivo csv en la tabla
  cargarCSV(event){
    let archivo = event.srcElement.files
    console.log(archivo)
    if (this.isValidCSVFile(archivo[0])) {
      this.nombreArchivo = archivo[0].name;
      let input = event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
    
      reader.onload = () => {
        let csvData = reader.result
        let csvRecordArray = (<string>csvData).split(/\r\n|\n/);
        csvRecordArray.forEach(e => {
          const par = e.split(";");
          this.soluciones.push({
            parametrosEntrada:par[0],
            salida:par[1]})
        })
        this.solucionesEmiter.emit(this.soluciones);
      }
    
      console.log(event)
  }
  }

  emitirSoluciones(){
    console.log(this.soluciones)
    this.solucionesEmiter.emit(this.soluciones);

  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }
}
