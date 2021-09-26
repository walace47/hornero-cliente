import { Component, OnInit, ViewChild } from '@angular/core';
import { Problema } from 'src/app/model/Problema';
import { JugarService } from 'src/app/services/jugar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Torneo } from 'src/app/model/Torneo';
import { TorneosService } from '../../services/torneos.service';
import { NotifierService } from 'angular-notifier';
import { environment } from 'src/environments/environment'
import { RespuestaJuego } from 'src/app/model/Jugar';
import { TorneoProblema } from 'src/app/model/TorneoProblema';
import { orderBy } from 'lodash';

@Component({
	selector: 'app-hornereando',
	templateUrl: './hornereando.component.html',
	styleUrls: ['./hornereando.component.css'],
})
export class HornereandoComponent implements OnInit {
	public problemaActual: TorneoProblema;
	public parametros: string;
	public respuestaSeleccionda: string;
	public torneo: Torneo;
	public respuestas: string[];
	public nroProblema = 1;
	public environment = environment;
	public token: string;
	@ViewChild("op") public op:any;
	public solicitudPediente: any;
	public bloquear: boolean = false;
	public penalidad: number = 0;
	public tiempoFinalizacion:number = -1;
	public tokenSolicitud: string;
	public idTorneo: string;
	public loading: boolean = false;
	public itemDropdown:any[]= [];
	constructor(
		private jugarService: JugarService,
		private activeRoute: ActivatedRoute,
		private torneoService: TorneosService,
		private router:Router,
		private notifier: NotifierService
	) { }

	ngOnInit(): void {
		this.token = this.activeRoute.snapshot.paramMap.get('token');
		this.idTorneo = this.activeRoute.snapshot.paramMap.get('id');
		this.init();

	}
	verPosicion(event){
		this.actualizarTorneo();
		this.op.show(event)
	}
	init() {
		this.torneoService.get(this.idTorneo, ["torneosUsuarios","torneosUsuarios.usuario",'torneosProblemas', 'torneosProblemas.problema']).toPromise()
			.then(t => {
				this.torneo = t;
				this.torneo.torneosUsuarios = orderBy(this.torneo.torneosUsuarios, ["puntos", "penalidad", "tiempo"], ["desc", "asc", "asc"])
				
				this.itemDropdown = orderBy(t.torneosProblemas,['orden'],['asc']).map( e =>({...e,label:e.orden + "-" + e.problema.nombre}) )
				const fechaFin = new Date(t.fechaFin).getTime();
				this.tiempoFinalizacion = fechaFin - new Date().getTime(); 
				if(this.tiempoFinalizacion <= 0 ){
					this.notifier.notify("info", "El torneo ha finalizado");
					this.router.navigate(['/inicio'])
				} 
				this.problemaActual = this.itemDropdown[0];
				this.solicitud();
			})
			.catch(e => {
				this.notifier.notify("error", "Problema al obtener el torneo")
			})
	}

	actualizarTorneo(){
		this.torneoService.get(this.idTorneo, ["torneosUsuarios","torneosUsuarios.usuario",'torneosProblemas', 'torneosProblemas.problema']).toPromise()
			.then(t => {
				this.torneo = t
				this.torneo.torneosUsuarios = orderBy(this.torneo.torneosUsuarios, ["puntos", "penalidad", "tiempo"], ["desc", "asc", "asc"])
			})
			.catch(e => {
				this.notifier.notify("error", "Problema al actualizar tabla de puntaje")
			})
	}

	finalizaTorneo(){
		this.tiempoFinalizacion=-1;
		this.notifier.notify("info", "El torneo ha finalizado");
		this.router.navigate(['/inicio'])


	}
	solicitud() {
		this.loading = true;
		if (this.problemaActual) {
			this.jugarService.obtenerParametrosEntrada(this.problemaActual.orden, this.token)
				.then(u => {
					switch (u.status) {
						case 1:
							this.parametros = u.parametrosEntrada;
							this.tokenSolicitud = u.token;
							this.respuestas = [...u.parametrosHornereando.incorrectos];
							this.respuestas.push(u.parametrosHornereando.correcta);
							shuffle(this.respuestas);
							this.solicitudPediente = u
							break;
						case 2:
							this.penalidad = u.penalidad
							break;
						default:
							break;
					}

				})
				.catch(e => {
					console.log(e)
					this.notifier.notify("error", "Problema al obtener la solicitud")
				})
				.finally(() => this.loading = false)

		}
	}

	tiempoCero() {
		this.solicitud();
		this.penalidad = 0;
	}

	submit() {
		this.bloquear = true;
		let respuesta: RespuestaJuego = {
			respuesta: this.respuestaSeleccionda,
			token: this.tokenSolicitud
		};
		console.log(this.problemaActual)
		console.log(respuesta)
		this.jugarService.enviarRespuesta(respuesta)
			.then(res => {
				switch (res.idEstado) {
					case 2:
						this.notifier.notify("success", `resultado:${res.estado}`);
						this.solicitud()
						break;
					case 3:
						this.penalidad = 60000;
						this.actualizarTorneo();
						this.notifier.notify("error", "La respuesta es incorrecta no lo puede volver a intentar en 1 minuto")
						break;
					case 10:
						this.notifier.notify("success", `resultado:${res.estado}`);
						this.solicitud()
						break;
					case 100:
						this.actualizarTorneo();
						this.notifier.notify("info", "Felicidades a recibido un punto");
						this.nroProblema++;
						//this.problemaActual = this.torneo.torneosProblemas[this.nroProblema - 1];
						this.solicitud()
						break;
					default:
						this.notifier.notify("error", `resultado:${JSON.stringify(res)}`);
						break;
				}
			})
			.catch(error => {
				this.notifier.notify("error", `Hubo un error en el servidor`)
			})
			.finally(() => this.bloquear = false)
	}

	cambioProblema() {
		this.solicitud();

	}


}
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}