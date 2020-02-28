import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import {MessageService, SelectItem} from 'primeng/api';
import { tipotorneo } from 'src/app/model/tipotorneo';
import { estadotorneo } from 'src/app/model/estadotorneo';
import { TorneosService } from 'src/app/services/torneos.service';
import { torneo } from 'src/app/model/torneo';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-crear-torneo',
  templateUrl: './crear-torneo.component.html',
  providers: [MessageService]

})
export class CrearTorneoComponent implements OnInit,OnDestroy {
  private suscripciones:Subscription[] = [];
  public torneoform: FormGroup;
  public submitted: boolean;
  public loading:boolean;
  public estadosTorneo: SelectItem[];
  public tiposTorneo: SelectItem[];
  public es: any;
  public id:string;
  public torneoEdicion:torneo;
  private esEdicion = false;

  constructor(   
     private fb: FormBuilder, 
     private messageService: MessageService,
     private _torneoService:TorneosService,
     private router:Router,
     private activeRoute:ActivatedRoute
    ) {
      this.loading = false
     }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    this.configIdioma();
    this.torneoform = this.fb.group({
      'nombre': new FormControl('', Validators.required),
      'descripcion': new FormControl('', Validators.required),
      'fechaInicio': new FormControl('', Validators.required),
      'fechaFin': new FormControl('',Validators.required),
      'estado': new FormControl('', Validators.required),
      'tipoTorneo': new FormControl('', Validators.required)
    },{validators:this.fechasInicioDebeSerMenor()})

    this.suscripciones.push(
    this._torneoService.getEstados().subscribe((estados:estadotorneo[]) =>{
      this.estadosTorneo = estados.map(elem => {return {label:elem.Estado, value:elem}})
      this.estadosTorneo.unshift({label:"Elija un estado del torneo",value:null})

    }))
    this.suscripciones.push(
    this._torneoService.getTipos().subscribe((tipos:tipotorneo[]) =>{
      this.tiposTorneo = tipos.map(elem => {return {label:elem.Tipo, value:elem}})
      this.tiposTorneo.unshift({label:"Elija un tipo de torneo",value:null})
    }))

    if(Number(this.id)){
      this.suscripciones.push(
        this._torneoService.get(this.id,['idTipo','idEstado']).subscribe((torneo)=>{
          this.torneoEdicion = torneo;
          this.esEdicion = true;
          this.torneoform.controls['nombre'].setValue(torneo.Nombre);
          this.torneoform.controls['descripcion'].setValue(torneo.Descripcion);
          this.torneoform.controls['fechaInicio'].setValue(new Date(torneo.FechaInicio));
          this.torneoform.controls['fechaFin'].setValue(new Date(torneo.FechaFin));
          this.torneoform.controls['estado'].setValue(torneo.idEstado);
          this.torneoform.controls['tipoTorneo'].setValue(torneo.idTipo);
        },
        (error)=> console.log(error))
      )
    }

  }

  onSubmit(value: any) {
    this.loading = true;
    this.submitted = true;
    let nuevoTorneo:torneo = {
      Nombre:value.nombre,
      Descripcion:value.descripcion,
      FechaInicio:value.fechaInicio,
      FechaFin:value.fechaFin,
      idEstado:value.estado,
      idTipo:value.tipoTorneo
    }
    if(this.esEdicion){
      nuevoTorneo.idTorneo = this.torneoEdicion.idTorneo;
      this.suscripciones.push(
        this._torneoService.edit(nuevoTorneo).subscribe(
          ()=>{
            this.messageService.add({severity:'info', summary:'Success', detail:'Form Submitted'});
            setTimeout( ()=> {
              this.loading = false
              this.router.navigate(["/torneos"])
            },2000 )
          },
          () => {
            this.messageService.add({severity:'error', summary:'Error Message', detail:'No se pudo editar torneo'});
            setTimeout( ()=> {
              this.loading = false
              this.router.navigate(["/torneos"])
            },2000 )
          }
          ))
    }else{
      this.suscripciones.push(
        this._torneoService.save(nuevoTorneo).subscribe(
          ()=> {
            this.messageService.add({severity:'info', summary:'Success', detail:'Form Submitted'});
            setTimeout( ()=> {
              this.loading = false
              this.router.navigate(["/torneos"])
            },2000 )
          },
          ()=>{
            this.messageService.add({severity:'error', summary:'Error Message', detail:'No se pudo crear torneo'});
            setTimeout( ()=> {
              this.loading = false
              this.router.navigate(["/torneos"])
            },2000 )
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
  verDatos(){
    console.log(this.torneoform)
  }

  configIdioma(){
    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
      dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
      dayNamesMin: [ "D","L","M","X","J","V","S" ],
      monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
      monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
      today: 'Hoy',
      clear: 'Borrar'
  }
  }
  ngOnDestroy(){
    this.suscripciones.forEach(sub => sub.unsubscribe())
  }
}
