import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TorneosService } from 'src/app/services/torneos.service';
import { torneo } from 'src/app/model/torneo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-torneo-detalle',
  templateUrl: './torneo-detalle.component.html',
})
export class TorneoDetalleComponent implements OnInit,OnDestroy {
  public id: string;
  public torneo: torneo;
  private suscripciones:Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private _torneo:TorneosService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.suscripciones.push(
    this._torneo.get( 
      this.id,
      ["torneoproblemas","torneoproblemas.idProblema","torneousuarios","torneousuarios.idUsuario","torneousuarios.idUsuario.idLenguaje"])
        .subscribe(torneo => this.torneo = torneo))
  }

  ngOnDestroy(){
    this.suscripciones.forEach(sub => sub.unsubscribe())
  }

}
