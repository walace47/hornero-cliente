import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TorneosService } from 'src/app/modules/torneo/services/torneos.service';
import { Torneo } from 'src/app/model/Torneo';
import { Subscription } from 'rxjs';
import { TorneoProblema } from 'src/app/model/TorneoProblema';
import { JugarService } from 'src/app/services/jugar.service';
import { EntradaJuego, RespuestaJuego } from 'src/app/model/Jugar';
import { NotifierService } from 'angular-notifier';
import { environment } from 'src/environments/environment'
import { js as jsPritier } from 'js-beautify'
import { BlocklySocketHandler } from 'src/app/services/blocklySocketHandler.service';
import invert from 'invert-color';
import { CodigoUsuarioService } from 'src/app/services/codigo-usuario.service';
import { CodigoUsuario } from 'src/app/model/CodigoUsuario';
import { UsuarioService } from 'src/app/modules/usuario/services/usuario.service'
import { orderBy } from 'lodash';

@Component({
	selector: 'app-swap',
	templateUrl: './swap.component.html',
	styleUrls: ['./swap.component.css'],
	providers: [
		TorneosService,
		JugarService,
		NotifierService,
		CodigoUsuarioService,
		UsuarioService
	]
})
export class SwapComponent implements OnInit {
	public items: MenuItem[];
	@ViewChild("op") public op:any;
	public environment = environment;
	public codeJs: string = null;
	public codeXml: string = null;
	public itemsTab: MenuItem[];
	public selectedProblem: TorneoProblema;
	public penalidad: number = 0;
	public xmlNuevo = "";
	public tiempoFinalizacion = -1;
	public torneo: Torneo;
	private suscripciones: Subscription[] = [];
	public isVisibleChat: boolean = false;
	public usuariosConectados: usuarioSala[];
	public token: string;
	public displayModal: boolean = false;
	public displayGuardar = false;
	public nombreCodigoAGuardar = ""
	public codigosUsuarios: CodigoUsuario[] = [];

	constructor(
		private codigoService: CodigoUsuarioService,
		private fb: FormBuilder,
		private _torneoService: TorneosService,
		private _jugarService: JugarService,
		private notifier: NotifierService,
		private activeRoute: ActivatedRoute,
		private _blocklySocket: BlocklySocketHandler,
		private _usuarioService: UsuarioService
	) {

		this._blocklySocket.socket.on('getUsuarios', (data: usuarioSala[]) => { this.usuariosConectados = data; })
	}


	ngOnInit(): void {
		this._usuarioService.getCodigos()
			.then(codigos => this.codigosUsuarios = codigos)
			.catch(error => console.log(error))
		this.token = this.activeRoute.snapshot.paramMap.get("idToken");
		const idTorneo = this.activeRoute.snapshot.paramMap.get("idTorneo");

		const relations = ["torneosProblemas", "torneosProblemas.problema"]
		this.suscripciones.push(this._torneoService.get(idTorneo, relations).subscribe(
			(torneo: Torneo) => {
				this.torneo = torneo;
				const fechaFin = new Date(torneo.fechaFin).getTime();
				this.tiempoFinalizacion = fechaFin - new Date().getTime(); 
			},
			(error: any) => console.log(error)
		))

		this.itemsTab = [
			{
				label: "Guardar", icon: "pi pi-pw pi-save", command: () => {
					this.displayGuardar = true
				}
			},
			{
				label: "Cargar", icon: "pi pi-pw pi-upload", command: () => {
					this.displayModal = true
				}
			},
			{ separator: true },
			{
				label: "Ejecutar", icon: "pi pi-pw pi-play", command: () => {
					this.ejecutarServidor()
						.then(() => { })
						.catch(() => { this.notifier.notify("error", "Hubo un error al conectarse con el servidor") })
				}
			},
			{
				label: "Ejecutar Local", icon: "pi pi-pw pi-play", command: () => {
					this.ejecutarLocal();
				}
			},
			{ separator: true },
			{
				label: "Chat", icon: "pi pi-pw pi-comment", command: () => {
					this.isVisibleChat = true
				}
			},


		]
		this.items = [
			{ label: 'Bloques', icon: 'pi pi-fw pi-home' },
			{ label: 'Javascript', icon: 'pi pi-fw pi-calendar' },
			{ label: 'Xml', icon: 'pi pi-fw pi-pencil' },
		];

		/*this.xmlForm = this.fb.group({
		  'xmlImportado': new FormControl(''),
		})*/

	}
	tiempoCero() {
		this.penalidad = 0;
	}
	//Guarda el xml en la base de datos
	guardarXml() {
		const nuevoCodigo: CodigoUsuario = {
			nombre: this.nombreCodigoAGuardar,
			codigo: this.codeXml,

		}
		this.codigoService.save(nuevoCodigo)
			.then(res => console.log(res))
			.catch(error => console.log(error))
		this.displayGuardar = false
	}
	//actualiza la solapa de js y xml, esta funcion la emite desde el componente hijo
	mostrarJs({ js, xml }) {

		js = js || null;
		xml = xml || null;
		this.codeJs = jsPritier(js);
		this.codeXml = xml;
	}
	actualizarTorneo(){
		this._torneoService.get(''+this.torneo.idTorneo, ["torneosUsuarios","torneosUsuarios.usuario",'torneosProblemas', 'torneosProblemas.problema']).toPromise()
			.then(t => {
				this.torneo = t
				this.torneo.torneosUsuarios = orderBy(this.torneo.torneosUsuarios, ["puntos", "penalidad", "tiempo"], ["desc", "asc", "asc"])
			})
			.catch(e => {
				this.notifier.notify("error", "Problema al actualizar tabla de puntaje")
			})
	}

	//invierte el color recibido en negro o blanco para mejor contraste
	cambiarColor(color: string) {
		return invert(color, true)
	}
	getfirstLeter(text: string = "") {
		return text.charAt(0).toUpperCase()
	}

	evaluar() {
		eval(this.codeJs);

	}


	//Ejecuta sobre el servidor el codigo escrito en los bloques
	async ejecutarServidor() {
		try {
			//Ejecuta solo si hay un codigo javascript
			if (this.codeJs) {
				//Def variable salida del programa
				let salida;
				//arreglo de parametros donde se van a cargar los parametros recibidos en el servidor
				let parametros = [];
				//Sino tiene ningun problema seleccionado
				if (!this.selectedProblem) {
					this.notifier.notify("error", `Seleccione un problema porfavor`);
					return false
				}
				//Pide los parametros de entrada para comepetir
				let entradaJuego: EntradaJuego = await this._jugarService.obtenerParametrosEntrada(this.selectedProblem.orden, this.token);
				if (entradaJuego.status === 1) {

					parametros = entradaJuego.parametrosEntrada.split(",");
					//Se define la funcion entrada que hace el manejo del bloque entrada.
					let entrada = (i: number) => {
						if (!parametros[i] && parametros[i] != 0) {
							parametros[i] = window.prompt('Entrada ' + i);
							if (!isNaN(parametros[i])) {
								return Number(parametros[i]);
							} else {
								return parametros[i];
							}
						} else {
							if (!isNaN(parametros[i])) {
								return Number(parametros[i]);
							} else {
								return parametros[i];
							}
						}
					}
					//Evalua el codigo en los bloques
					eval(this.codeJs);
					//captura la respuesta en la variable salida
					const respuestaJuego: RespuestaJuego = {
						respuesta: salida,
						token: entradaJuego.token
					};
					//responde al servidor
					const res = await this._jugarService.enviarRespuesta(respuestaJuego);
					if (res.idEstado === 2) {
						this.notifier.notify("success", `resultado:${res.estado}`);
					} else if (res.idEstado === 100) {
						this.notifier.notify("info", "Felicidades a recibido un punto")
					} else if (res.idEstado === 10) {
						this.notifier.notify("info", "La respuesta es correcta pero ya a ganado el punto del problema")
					} else if (res.idEstado === 3) {
						this.penalidad = 60000;
						this.notifier.notify("error", "La respuesta es incorrecta no lo puede volver a intentar en 1 minuto")
					}
					else {
						this.notifier.notify("error", `resultado:${JSON.stringify(res)}`);
					}
				}else if(entradaJuego.status === 2){
					this.penalidad = entradaJuego.penalidad
				}
			}
			return true;
		} catch (error) {
			const mensaje = error.error.error ? error.error.error : "Hubo un error al conectarse con el servidor";
			this.notifier.notify("error", mensaje)
		}
	}
	verPosicion(event){
		this.actualizarTorneo();
		this.op.show(event)
	}
	//Ejecuta de manera local el codigo que hay en los bloques
	ejecutarLocal() {
		if (this.codeJs) {
			let salida;
			let parametros = [];

			let entrada = (i: number) => {
				if (!parametros[i] && parametros[i] != 0) {
					//this.displayEntrada = true;
					parametros[i] = window.prompt('Entrada ' + i);
					if (!isNaN(parametros[i])) {
						return Number(parametros[i]);
					} else {
						return parametros[i];
					}
				} else {
					if (!isNaN(parametros[i])) {
						return Number(parametros[i]);
					} else {
						return parametros[i];
					}
				}
			}
			eval(this.codeJs)
			window.alert("La respuesta es: " + salida);
			console.log(salida)
		}
	}

}
interface blockHandler {
	token: string;
	xml: string;
	usuario?: string;
	usuariosConectados?: usuarioSala[]
}

interface usuarioSala {
	nombreUsuario?: string,
	color?: string,
	bloqueSeleccionado?: string
}