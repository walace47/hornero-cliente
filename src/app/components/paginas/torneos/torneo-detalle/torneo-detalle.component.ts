import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TorneosService } from 'src/app/services/torneos.service';
import { torneo } from 'src/app/model/torneo';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { LoginService } from 'src/app/services/login.service';
import { torneousuario } from 'src/app/model/torneousuario';

@Component({
  selector: 'app-torneo-detalle',
  templateUrl: './torneo-detalle.component.html',
})
export class TorneoDetalleComponent implements OnInit,OnDestroy {
  public id: string;
  public torneo: torneo;
  private suscripciones:Subscription[] = [];
  public torneoUsuario:torneousuario;
  constructor(
    private route: ActivatedRoute,
    private _torneo:TorneosService,
    private _usuarioService:UsuarioService,
    private _loginService:LoginService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.suscripciones.push(
    this._torneo.get( 
      this.id,
      ["torneoproblemas","torneoproblemas.idProblema","torneousuarios","torneousuarios.idUsuario","torneousuarios.idUsuario.idLenguaje"])
        .subscribe(torneo => {
          this.torneo = torneo;
      
          if(this._loginService.isLogin()){
            this._usuarioService.getTorneos().then(torneo =>{
              this.torneoUsuario = torneo.find( user => user.idTorneo.idTorneo === this.torneo.idTorneo)
            })
            .catch(error => console.log(error))
          }
        }))

  }

  isLogin(){
    return this._loginService.isLogin();
  }

  ngOnDestroy(){
    this.suscripciones.forEach(sub => sub.unsubscribe())
  }

}
