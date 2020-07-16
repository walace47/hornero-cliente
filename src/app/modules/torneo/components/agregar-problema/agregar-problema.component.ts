import {Component, OnInit, Output,EventEmitter, Input, ViewChild, OnDestroy } from '@angular/core';
import { Problema } from 'src/app/model/Problema';
import { TorneoProblema } from 'src/app/model/TorneoProblema';
import { ProblemaService } from 'src/app/modules/problema/services/problema.service';
import { COMPLEJIDAD,Complejidad } from 'src/app/model/Complejidad';
import { Subscription } from 'rxjs';
import {unionBy} from "lodash"
import { Table } from 'primeng/table/table';


@Component({
  selector: 'app-agregar-problema',
  templateUrl: './agregar-problema.component.html',
  styleUrls: ['./agregar-problema.component.css'],
})
export class AgregarProblemaComponent implements OnInit, OnDestroy {

  private suscripciones:Subscription[] = [];
  displayDialog: boolean;
  @Output("problemaSeleccionado") problemasOutput = new EventEmitter();
  @Input("esEdicion") esEdicion:boolean = false;
  @Input("problemasTorneo") 
  set problemasTorneo(problemas:any[]){
    if(problemas.length > 0){
      this.problemasSeleccionadoAux = problemas.map(e => e.problema)
      this.problemasTorneoElegidos = this.problemasSeleccionadoAux;
    }
  }
  @ViewChild('dt') tableSeleccion: Table;

  public todoLosProblemas:Problema[] =[];
  
  public problemasTorneoElegidos: Problema[] = [];
  public problemasSeleccionadoAux:Problema[] = [];

  public opcionesComplejidad:Complejidad[]= [
    {
      idComplejidad:COMPLEJIDAD.baja,
      complejidad:"Baja"
    },
    {
      idComplejidad:COMPLEJIDAD.media,
      complejidad:"Media"
    },
    {
      idComplejidad:COMPLEJIDAD.alta,
      complejidad:"Alta"
    }
      ]

  cols: any[] = [];

  constructor(private _problemas:ProblemaService) {
   }

   filtratPorComplejidad(evento){
     console.log(evento.value);
     const vals = evento.value.map(e => e.complejidad)
     this.tableSeleccion.filter(vals, 'complejidad.complejidad', 'in')

   }
  ngOnInit() {
    this.suscripciones.push(
      this._problemas.getAll(["complejidad"]).subscribe(problemas => this.todoLosProblemas = problemas))
    if(this.esEdicion){
      this.cols = [
        { field: 'Nro', width: '10%'},
        { field: 'Nombre',width: '90%'}];
    }else{
      this.cols = [
        { field: 'Nro', width: '10%'},
        { field: 'Nombre',width: '80%'},
        { field: '',width: "10%"}
      ];
    }
      
  }


  showDialogToAdd() {
      this.displayDialog = true;
  }

  agregar(){
    console.log(this.esEdicion)

    this.problemasTorneoElegidos = unionBy(this.problemasTorneoElegidos,this.problemasSeleccionadoAux,"idProblema");

    this.problemasOutput.emit(this.problemasTorneoElegidos);
    this.displayDialog = false;
  }

  deteleElemt(id){
    console.log(this.esEdicion)
    if(!this.esEdicion){
      this.problemasTorneoElegidos = this.problemasTorneoElegidos.filter(problema => id != problema.idProblema)
      this.problemasSeleccionadoAux = this.problemasTorneoElegidos;
      this.problemasOutput.emit(this.problemasTorneoElegidos);
    }
  }
  ngOnDestroy(){
    this.suscripciones.forEach(e => e.unsubscribe());
  }
}
