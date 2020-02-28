import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {SelectItem} from 'primeng/api';
import { torneo } from 'src/app/model/torneo';
import {TorneosService} from '../../../services/torneos.service'
import { LoginService } from 'src/app/services/login.service';
@Component({
  selector: 'app-torneos',
  templateUrl: './torneos.component.html',
  styleUrls: ['./torneos.component.css'],
  providers:[]
})
export class TorneosComponent implements OnInit {
  public mensaje:any;
  public displayMensaje:boolean = false
  torneos: torneo[];
  selectTorneo: torneo;
  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string;
  sortOrder: number;

  constructor(
    private _torneos:TorneosService,
    private _loginService:LoginService,
    private router:Router) { 
      this.mensaje = {
        datos:"",
        header:""
      }
    }


  ngOnInit() {
      this._torneos.getAll().subscribe((torneos:torneo[]) => {this.torneos = torneos})
      this.sortOptions = [
          {label: 'Oldest First', value: 'FechaFin'},
          {label: 'Newest First', value: '!FechaFin'},
      ];
  }

  selectCar(event: Event, torneo: torneo) {
      this.selectTorneo = torneo;
      event.preventDefault();
  }

  onSortChange(event) {
      let value = event.value;

      if (value.indexOf('!') === 0) {
          this.sortOrder = -1;
          this.sortField = value.substring(1, value.length);
      }
      else {
          this.sortOrder = 1;
          this.sortField = value;
      }
  }

  onDialogHide() {
      this.selectTorneo = null;
  }

  inscribirse(torneo:torneo){
    if(!this._loginService.isLogin()){
        this._loginService.setDisplay(true);
    }else{
        this._torneos.inscribirse(torneo.idTorneo).subscribe( 
        ()=>{
          this.router.navigate(['/torneos',torneo.idTorneo])
        },
        (error)=>{
          switch(error.status){
            case 400:{
              this.mensaje.header ="Ya estas inscripto"
              this.mensaje.datos = `Ya estas registrado en este torneo ${torneo.Nombre} `
              this.displayMensaje = true;
            }
          }
        })
    }
  }

  incripcionHabilitada(torneo:torneo){
    const fechaTorneo = new Date(torneo.FechaFin);
    return fechaTorneo > (new Date()) 
  }

}
