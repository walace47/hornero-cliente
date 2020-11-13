import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TorneosService } from 'src/app/modules/torneo/services/torneos.service';
import { Torneo, TIPO_TORNEO } from 'src/app/model/Torneo';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/modules/usuario/services/usuario.service';
import { LoginService } from 'src/app/modules/shared/service/login.service';
import { TorneoUsuario } from 'src/app/model/TorneoUsuario';
import { orderBy } from "lodash"
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
	selector: 'app-torneo-detalle',
	templateUrl: './torneo-detalle.component.html',
	styleUrls: ['./torneo-detalle.component.css'],
	animations: [
        trigger('rowExpansionTrigger', [
            state('void', style({
                transform: 'translateX(-10%)',
                opacity: 0
            })),
            state('active', style({
                transform: 'translateX(0)',
                opacity: 1
            })),
            transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class TorneoDetalleComponent implements OnInit, OnDestroy {
	public id: string;
	public torneo: Torneo;
	private suscripciones: Subscription[] = [];
	public torneoUsuario: TorneoUsuario;
	public tiempoRestante: number = 0;
	public estaFinalizado: boolean = false;
	public tiempoFinalizacion: number = 0;
	public esHornerando: boolean = false;
	public puedeEditar = false;
	public problemasResuelto:any[]; 
	constructor(
		private route: ActivatedRoute,
		private _torneo: TorneosService,
		private _usuarioService: UsuarioService,
		private _loginService: LoginService,
		private _torneos: TorneosService,
	) { }

	ngOnInit(): void {
		this.cargarDatos();
	}

	getUsuarios(orden:number){
		return this.problemasResuelto[orden].usuario.map(e => e.nombre)
	}

	cargarDatos(): void {
		this.id = this.route.snapshot.paramMap.get('id');
		this.suscripciones.push(
			this._torneo.get(
				this.id,
				["estado", "tipo", "torneosProblemas", "torneosProblemas.problema", "torneosUsuarios", "torneosUsuarios.usuario", "torneosUsuarios.usuario.lenguajeFavorito"])
				.subscribe(torneo => {
					this.torneo = torneo;
					this._torneos.problemaResuelto(torneo.idTorneo)
						.then(t => this.problemasResuelto = t)
						.catch(e => console.log(e))

					this.puedeEditar = (this._loginService.isDocente() && this._loginService.esDuenio(torneo)) || this._loginService.isAdmin();

					this.esHornerando = torneo.tipo.idTipo === TIPO_TORNEO.hornerando;
					this.torneo.torneosUsuarios = orderBy(this.torneo.torneosUsuarios, ["puntos", "penalidad", "tiempo"], ["desc", "asc", "asc"])
					if (this._loginService.isLogin()) {
						this._usuarioService.getTorneos()
							.then(torneo => {
								this.torneoUsuario = torneo.find(user => user.torneo.idTorneo === this.torneo.idTorneo)
							})
							.catch(error => console.log(error))
					}
					const fechaIni = (new Date(this.torneo.fechaInicio));
					const fechaFin = (new Date(this.torneo.fechaFin));
					this.tiempoRestante = fechaIni.getTime() - (new Date()).getTime();
					this.tiempoFinalizacion = fechaFin.getTime() - (new Date).getTime();
				}))

	}

	isLogin() {
		return this._loginService.isLogin();
	}

	ngOnDestroy() {
		this.suscripciones.forEach(sub => sub.unsubscribe())
	}


	inscribirse() {
		if (!this._loginService.isLogin()) {
			this._loginService.setDisplay(true);
		} else {
			this._torneos.inscribirse(this.torneo.idTorneo)
				.then(() => this.cargarDatos())
				.catch(error => console.log(error));
		}
	}

	login() {
		console.log("login")
		this._loginService.setDisplay(true);
	}



}
