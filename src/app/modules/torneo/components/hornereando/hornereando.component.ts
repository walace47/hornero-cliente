import { Component, OnInit } from '@angular/core';
import { Problema } from 'src/app/model/Problema';
import { JugarService } from 'src/app/services/jugar.service';
import { ActivatedRoute } from '@angular/router';
import { Torneo } from 'src/app/model/Torneo';
import { TorneosService } from '../../services/torneos.service';
import { NotifierService } from 'angular-notifier';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-hornereando',
  templateUrl: './hornereando.component.html',
  styleUrls: ['./hornereando.component.css'],
})
export class HornereandoComponent implements OnInit {
  public problemaActual:Problema = {nombre:"problema numero 1",enunciado:"algo largo"};
  public parametros:string;
  public respuestaSeleccionda:string;
  public torneo:Torneo;
  public respuestas:string[];
  public nroProblema = 1;
  public environment = environment;
  public token:string;
  public solicitudPediente:any;

  constructor(
    private jugarService:JugarService,
    private activeRoute:ActivatedRoute,
    private torneoService:TorneosService,
    private notifier: NotifierService
  ) { }

  ngOnInit(): void {
    this.token = this.activeRoute.snapshot.paramMap.get('token');
    const idTorneo = this.activeRoute.snapshot.paramMap.get('id');
    this.torneoService.get(idTorneo,['torneosProblemas','torneosProblemas.problema']).toPromise()
      .then(t =>{
        this.torneo = t;
        return this.jugarService.obtenerUltimoProblema(this.token)
      })
      .then(u => {
        this.nroProblema = u.problemaActual;
        this.problemaActual = this.torneo.torneosProblemas.find(e => e.orden === u.problemaActual).problema
        this.solicitud() 
      })
      .catch(e =>{
        console.log(e)
         this.notifier.notify("error","Problema al obtener el torneo")})
  }

  solicitud(){
    this.jugarService.obtenerParametrosEntrada(this.nroProblema,this.token)
      .then(u => {
        this.parametros = u.parametrosEntrada
        this.respuestas = [...u.parametrosHornereando.incorrectos]
        this.respuestas.push(u.parametrosHornereando.correcta)
        this.solicitudPediente = u
        console.log(this.solicitudPediente)
      })
  }

}
