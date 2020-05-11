import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TorneosService } from 'src/app/services/torneos.service';
import { Torneo } from 'src/app/model/Torneo';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { LoginService } from 'src/app/services/login.service';
import { TorneoUsuario } from 'src/app/model/TorneoUsuario';
import { orderBy} from "lodash"
@Component({
  selector: 'app-torneo-detalle',
  templateUrl: './torneo-detalle.component.html',
  styleUrls:['./torneo-detalle.component.css']
})
export class TorneoDetalleComponent implements OnInit,OnDestroy {
  public id: string;
  public torneo: Torneo;
  private suscripciones:Subscription[] = [];
  public torneoUsuario:TorneoUsuario;
  constructor(
    private route: ActivatedRoute,
    private _torneo:TorneosService,
    private _usuarioService:UsuarioService,
    private _loginService:LoginService,
    private _torneos: TorneosService,
    ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }


  cargarDatos():void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.suscripciones.push(
    this._torneo.get( 
      this.id,
      ["torneosProblemas","torneosProblemas.problema","torneosUsuarios","torneosUsuarios.usuario","torneosUsuarios.usuario.lenguajeFavorito"])
        .subscribe(torneo => {
          this.torneo = torneo;
          this.torneo.torneosUsuarios = orderBy(this.torneo.torneosUsuarios,"puntos","desc")
      
          if(this._loginService.isLogin()){
            this._usuarioService.getTorneos().then(torneo =>{
              this.torneoUsuario = torneo.find( user => user.torneo.idTorneo === this.torneo.idTorneo)
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


  inscribirse() {
    if (!this._loginService.isLogin()) {
      this._loginService.setDisplay(true);
    } else {
      this._torneos.inscribirse(this.torneo.idTorneo)
        .then(()=> this.cargarDatos())
        .catch(error => console.log(error));
    }
  }
  


}
