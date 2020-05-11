import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TorneosService } from 'src/app/services/torneos.service';
import { Torneo } from 'src/app/model/Torneo';
import { Subscription } from 'rxjs';
import { TorneoProblema } from 'src/app/model/TorneoProblema';
import { JugarService } from 'src/app/services/jugar.service';
import { EntradaJuego,RespuestaJuego } from 'src/app/model/Jugar';
import { NotifierService } from 'angular-notifier';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.css'],
  providers:[TorneosService,JugarService,NotifierService]
})
export class SwapComponent implements OnInit {
  items: MenuItem[];
  public environment = environment;
  public codeJs:string = null;
  public codeXml:string = null;
  itemsTab: MenuItem[];
  public selectedProblem:TorneoProblema;
  public valorEntrada:number;
  public resultado = 0;
  public xmlNuevo = "";
  public displayResultado = false;
  public xmlForm:FormGroup;
  public torneo:Torneo;
  private suscripciones:Subscription[] = [];


  public token: string;
  problemas: any[] = [{name:"1"},{name:"2"},{name:"3"},{name:"4"}]


  constructor(
    private fb: FormBuilder,
    private _torneoService:TorneosService,
    private _jugarService:JugarService,
    private notifier:NotifierService,
    private activeRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.token = this.activeRoute.snapshot.paramMap.get("idToken");
    const idTorneo = this.activeRoute.snapshot.paramMap.get("idTorneo");

    const relations = ["torneosProblemas","torneosProblemas.problema"]
    this.suscripciones.push(this._torneoService.get(idTorneo,relations).subscribe(
      (torneo:Torneo) => {this.torneo = torneo; console.log(torneo)},
      (error:any) => console.log(error)
    ))

    this.itemsTab = [
      {label:"Guardar", icon:"pi pi-pw pi-save",},
      {label:"Cargar", icon:"pi pi-pw pi-upload", items:[[{label:"Saves",items:[{label:"cargar1"}]}]]},
      {label:"Ejecutar", icon:"pi pi-pw pi-play", command: () => {
        this.ejecutarServidor()
          .then(() =>{})
          .catch(()=>{this.notifier.notify("error","Ubo un error al conectarse con el servidor")})
      }},
      {label:"Ejecutar Local", icon:"pi pi-pw pi-play",command:()=>{
        this.ejecutarLocal();  
      }},

    ]
    this.items = [
      {label: 'Bloques', icon: 'pi pi-fw pi-home'},
      {label: 'Javascript', icon: 'pi pi-fw pi-calendar'},
      {label: 'Xml', icon: 'pi pi-fw pi-pencil'},
      {label:'Problema',icon:''}
  ];

  this.xmlForm = this.fb.group({
    'xmlImportado': new FormControl(''),
  })
  }

  onSubmit(value:any){
    console.log(typeof value.xmlImportado);
    this.xmlNuevo = value.xmlImportado;
  }

  mostrarJs({js,xml}){

    js = js || null;
    xml = xml || null;
    //console.log(js);
    this.codeJs = js;
    this.codeXml = xml;
   // console.log(this.codeXml)
  }

  evaluar(){
    eval(this.codeJs);
    
  }


  async ejecutarServidor(){
    try{

      if(this.codeJs){
        let respuesta;
        let parametros = [];
        console.log(this.selectedProblem)
        if(!this.selectedProblem){
          this.notifier.notify("error",`Seleccione un problema porfavor`);
          return false
        }
        let entradaJuego:EntradaJuego = await this._jugarService.obtenerParametrosEntrada(this.selectedProblem.orden,this.token);
        console.log(entradaJuego);
        parametros = entradaJuego.parametrosEntrada.split(",");
        let entrada = (i:number) =>{
          if(!parametros[i] && parametros[i] != 0){
            parametros[i] =  window.prompt('Entrada '+ i);
            return parametros[i];
          }else{
            return parametros[i];
          }
        }
        eval(this.codeJs);
        const respuestaJuego:RespuestaJuego = {
          respuesta,
          token:entradaJuego.token
        };
        const res = await this._jugarService.enviarRespuesta(respuestaJuego);
        if(res.idEstado === 2 ){ 
          this.notifier.notify("success",`resultado:${res.estado}`);
        }else if(res.idEstado === 100){
          this.notifier.notify("info","Felicidades a recibido un punto")
        }
        else{
          this.notifier.notify("error",`resultado:${JSON.stringify(res)}`);
        }
      }
      return true;

    }catch(error){
      console.log(error);
      this.notifier.notify("error","Ubo un error al conectarse con el servidor")
    }
  }

  ejecutarLocal(){
    if(this.codeJs){
      let respuesta;
      let parametros = [];

      let entrada = (i:number) =>{
        if(!parametros[i] && parametros[i] != 0){
          //this.displayEntrada = true;
          parametros[i] =  window.prompt('Entrada '+ i);
          return parametros[i];
        }else{
          return parametros[i];
        }
      }
      eval(this.codeJs)
      window.alert("La respuesta es: " + respuesta);
      console.log(respuesta)
    }
  }

}
