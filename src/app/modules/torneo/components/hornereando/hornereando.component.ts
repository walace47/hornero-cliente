import { Component, OnInit } from '@angular/core';
import { Problema } from 'src/app/model/Problema';
import { JugarService } from 'src/app/services/jugar.service';
import { ActivatedRoute } from '@angular/router';
import { Torneo } from 'src/app/model/Torneo';
import { TorneosService } from '../../services/torneos.service';
import { NotifierService } from 'angular-notifier';
import { environment } from 'src/environments/environment'
import { RespuestaJuego } from 'src/app/model/Jugar';
import { TorneoProblema } from 'src/app/model/TorneoProblema';

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
	public solicitudPediente: any;
	public bloquear: boolean = false;
	public penalidad: number = 0;
	public tokenSolicitud: string;
	public idTorneo: string;
	public loading: boolean = false;
	constructor(
		private jugarService: JugarService,
		private activeRoute: ActivatedRoute,
		private torneoService: TorneosService,
		private notifier: NotifierService
	) { }

	ngOnInit(): void {
		this.token = this.activeRoute.snapshot.paramMap.get('token');
		this.idTorneo = this.activeRoute.snapshot.paramMap.get('id');
		this.init();

	}
	init() {
		this.torneoService.get(this.idTorneo, ['torneosProblemas', 'torneosProblemas.problema']).toPromise()
			.then(t => {
				this.torneo = t;
				this.problemaActual = t.torneosProblemas[0];
				this.solicitud();
				//return this.jugarService.obtenerUltimoProblema(this.token);
			})
			.catch(e => {
				console.log(e)
				this.notifier.notify("error", "Problema al obtener el torneo")
			})
	}

	solicitud() {
		this.loading = true;
		if (this.problemaActual) {
			console.log(this.problemaActual)

			this.jugarService.obtenerParametrosEntrada(this.problemaActual.orden, this.token)
				.then(u => {
					switch (u.status) {
						case 1:

							this.parametros = u.parametrosEntrada;
							this.tokenSolicitud = u.token;
							this.respuestas = [...u.parametrosHornereando.incorrectos]
							this.respuestas.push(u.parametrosHornereando.correcta)
							shuffle(this.respuestas)
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
						this.notifier.notify("error", "La respuesta es incorrecta no lo puede volver a intentar en 5 minutos")
						break;
					case 10:
						this.notifier.notify("success", `resultado:${res.estado}`);
						this.solicitud()
						break;
					case 100:
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
				console.log(error);
				this.notifier.notify("error", `Ubo un error en el servidor`)
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