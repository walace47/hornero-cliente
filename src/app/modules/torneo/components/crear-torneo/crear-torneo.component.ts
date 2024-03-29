import { Component, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageService, SelectItem } from 'primeng/api';
import { TipoTorneo } from 'src/app/model/TipoTorneo';
import { EstadoTorneo } from 'src/app/model/EstadoTorneo';
import { TorneosService } from 'src/app/modules/torneo/services/torneos.service';
import { Torneo } from 'src/app/model/Torneo';
import { Router, ActivatedRoute } from '@angular/router';
import { Problema } from 'src/app/model/Problema';
import { TorneoProblema } from 'src/app/model/TorneoProblema';
import { NotifierService } from 'angular-notifier';
import { orderBy } from 'lodash';


@Component({
	selector: 'app-crear-torneo',
	templateUrl: './crear-torneo.component.html',
	providers: [MessageService]

})
export class CrearTorneoComponent implements OnInit, OnDestroy {
	private suscripciones: Subscription[] = [];
	public torneoform: FormGroup;
	public submitted: boolean;
	public loading: boolean;
	public estadosTorneo: SelectItem[];
	public tiposTorneo: SelectItem[];
	public es: any;
	public problemas: TorneoProblema[] = [];
	public id: string;
	public torneoEdicion: Torneo;
	public esEdicion = false;

	constructor(
		private fb: FormBuilder,
		private _torneoService: TorneosService,
		private router: Router,
		private activeRoute: ActivatedRoute,
		private notifier: NotifierService
	) {
		this.loading = false
	}




	ngOnInit(): void {
		this.activeRoute.paramMap.subscribe(params => {
			this.problemas = [];
			this.esEdicion = false;

			this.torneoEdicion = null;
			this.suscripciones.forEach(sub => sub.unsubscribe())
			this.suscripciones = [];
			this.id = this.activeRoute.snapshot.paramMap.get("id");
			console.log(this.id);
			this.configIdioma();
			this.torneoform = this.fb.group({
				'nombre': new FormControl('', Validators.required),
				'descripcion': new FormControl('', Validators.required),
				'fechaInicio': new FormControl('', Validators.required),
				'fechaFin': new FormControl('', Validators.required),
				'estado': new FormControl('', Validators.required),
				'tipoTorneo': new FormControl('', Validators.required)
			}, { validators: this.fechasInicioDebeSerMenor() })

			this.suscripciones.push(
				this._torneoService.getEstados().subscribe((estados: EstadoTorneo[]) => {
					this.estadosTorneo = estados.map(elem => { return { label: elem.estado, value: elem } })
					this.estadosTorneo.unshift({ label: "Elija un estado del torneo", value: null })

				}))
			this.suscripciones.push(
				this._torneoService.getTipos().subscribe((tipos: TipoTorneo[]) => {
					this.tiposTorneo = tipos.map(elem => { return { label: elem.tipo, value: elem } })
					this.tiposTorneo.unshift({ label: "Elija un tipo de torneo", value: null })
				}))



			if (Number(this.id)) {
				console.log("hola mundo");
				this.suscripciones.push(
					this._torneoService.get(this.id, ['tipo', 'estado', 'torneosProblemas', 'torneosProblemas.problema']).subscribe((torneo) => {
						this.torneoEdicion = torneo;

						this.problemas = orderBy(torneo.torneosProblemas, "orden", "asc");

						this.esEdicion = true;
						this.torneoform.controls['nombre'].setValue(torneo.nombre);
						this.torneoform.controls['descripcion'].setValue(torneo.descripcion);
						this.torneoform.controls['fechaInicio'].setValue(new Date(torneo.fechaInicio));
						this.torneoform.controls['fechaFin'].setValue(new Date(torneo.fechaFin));
						this.torneoform.controls['estado'].setValue(torneo.estado);
						this.torneoform.controls['tipoTorneo'].setValue(torneo.tipo);
					},
						(error) => console.log(error))
				)
			}
		})


	}
	agregarProblemas(problemas: Problema[]) {
		let problemaTorneo: TorneoProblema[];
		problemaTorneo = problemas.map((p, i) => ({
			orden: i + 1,
			problema: p
		}))
		console.log(problemaTorneo);
		for (let i = 0; i < problemaTorneo.length; i++) {
			let buscarProblema = this.problemas.find(
				(p: TorneoProblema) => p.problema.idProblema === problemaTorneo[i].problema.idProblema
			);

			if (buscarProblema) {
				buscarProblema.orden = problemaTorneo[i].orden;
			} else {
				this.problemas.push(problemaTorneo[i]);
			}
		}
		console.log(this.problemas);


	}

	handleKeyEnter(event) {
		event.preventDefault();
	}

	onSubmit(value: any) {
		this.loading = true;
		this.submitted = true;
		let nuevoTorneo: Torneo = {
			nombre: value.nombre,
			descripcion: value.descripcion,
			fechaInicio: value.fechaInicio,
			torneosProblemas: this.problemas,
			fechaFin: value.fechaFin,
			estado: value.estado,
			tipo: value.tipoTorneo
		}
		if (this.esEdicion) {
			nuevoTorneo.idTorneo = this.torneoEdicion.idTorneo;
			this.suscripciones.push(
				this._torneoService.edit(nuevoTorneo).subscribe(
					() => {
						this.loading = false;
						this.notifier.notify("success", "Torneo Editado");
						this.router.navigate(["/torneos"])
					},
					() => {
						this.loading = false;
						this.notifier.notify("error", "EL torneo no se pudo editar");
						this.router.navigate(["/torneos"])
					}
				))
		} else {
			console.log(nuevoTorneo);
			this.suscripciones.push(
				this._torneoService.save(nuevoTorneo).subscribe(
					() => {
						this.notifier.notify("success", "Torneo Creado");
						this.loading = false
						this.router.navigate(["/torneos"])
					},
					() => {
						this.notifier.notify("error", "EL torneo no se pudo crear");
						this.loading = false
						this.router.navigate(["/torneos"])
					}))
		}
	}

	fechasInicioDebeSerMenor() {
		return (formGroup: FormGroup) => {
			const fechaFin = formGroup.controls['fechaFin'].value;
			const fechaInicio = formGroup.controls['fechaInicio'].value;
			const matchingControl = formGroup.controls['fechaFin'];


			if (matchingControl.errors && !matchingControl.errors.mustMatch) {
				// return if another validator has already found an error on the matchingControl
				return;
			}
			// set error on matchingControl if validation fails
			if (fechaFin < fechaInicio) {
				matchingControl.setErrors({ fechaMenor: true });
			} else {
				matchingControl.setErrors(null);
			}
		}
	}
	verDatos() {
		console.log(this.torneoform)
	}

	configIdioma() {
		this.es = {
			firstDayOfWeek: 1,
			dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
			dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
			dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
			monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
			monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
			today: 'Hoy',
			clear: 'Borrar'
		}
	}
	ngOnDestroy() {
		this.suscripciones.forEach(sub => sub.unsubscribe())
	}
}
