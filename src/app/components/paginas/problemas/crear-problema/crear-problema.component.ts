import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api/selectitem';
import { MultiSelect } from 'primeng/multiselect/public_api';
import { Problema } from 'src/app/model/Problema';
import { MenuItem } from 'primeng/api';
import { Solucion } from 'src/app/model/Solucion';
import { ComplejidadService } from 'src/app/services/complejidad.service';
import { Complejidad } from 'src/app/model/Complejidad';
import { Etiqueta } from 'src/app/model/Etiqueta';
import { EtiquetasService } from 'src/app/services/etiqueta.service';
import { ArchivoService } from 'src/app/services/archivo.service';
import { ProblemaService } from 'src/app/services/problema.service';


@Component({
  selector: 'app-crear-problema',
  templateUrl: './crear-problema.component.html',
  styleUrls:[`./crear-problema.component.css`],
  providers:[
    ComplejidadService,
    EtiquetasService,
    ArchivoService,
    ProblemaService]
})
export class CrearProblemaComponent implements OnInit {

  @ViewChild("ms") ms:MultiSelect;
  complejidades: SelectItem[];
  complejidadSeleccionada: string[] = [];

  
  items: SelectItem[];
  item: string;

  etapas: MenuItem[];
  public etiquetasOpt:SelectItem[] = []
  private suscripciones:Subscription[] = [];
  public problemaForm: FormGroup;
  public submitted: boolean;
  public loading:boolean;
  public id:string;

  public soluciones:Solucion[];
  private esEdicion = false;
  public archivo:File;

  constructor(
    private fb: FormBuilder, 
    private activeRoute:ActivatedRoute,
    private complejidadService:ComplejidadService,
    private etiquetaService:EtiquetasService,
    private subirArchivoService:ArchivoService,
    private problemaService:ProblemaService) { 
      this.etapas = [
          {label:"Problema"},
          {label:"Resoluciones"}]

          
      this.complejidades = [];


    }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    this.complejidadService.getAll().then(
      (complejidades:Complejidad[]) => 
        {
          console.log(complejidades)
          this.complejidades = complejidades.map(e => ({label:e.complejidad,value:e})) 
          console.log(this.complejidades)
        })
        .catch(error => console.log(error))


    this.etiquetaService.getAll()
      .then((etiquetas:Etiqueta[]) => {
        this.etiquetasOpt = etiquetas.map(e => ({label:e.etiqueta,value:e})) 
      })
      .catch(error => console.log(error))

    this.problemaForm = this.fb.group({
      'nombre': new FormControl('', Validators.required),
      'archivo': new FormControl(''),
      'file':new FormControl(''),
      'enunciado':new FormControl('',Validators.required),
      'complejidad':new FormControl('',Validators.required),
      'tiempoEjecucion':new FormControl('',Validators.required),
      'etiquetas':new FormControl('')
    }) 
  }

  onSubmit(problema:object){
    let nuevoProblema:Problema = {
      nombre: this.problemaForm.value['nombre'],
      archivo: this.problemaForm.value['archivo'],
      enunciado: this.problemaForm.value['enunciado'],
      tipo: this.problemaForm.value['tipo'],
      complejidad:this.problemaForm.value['complejidad'],
      tiempoEjecucionMax:this.problemaForm.value['tiempoEjecucion'],
      etiquetas:this.problemaForm.value['etiquetas'],
      soluciones:this.soluciones
    }

    console.log(this.problemaForm.value.file);
    this.problemaService.crear(nuevoProblema)
      .then((res)=> console.log(res))
      .catch(error => console.log(error))
  console.log(this.problemaForm)

    this.subirArchivoService.subirArchivo("problemas",this.problemaForm.value['archivo'],this.problemaForm.value['file'])
      .then((res) => console.log(res))
      .catch(error => console.log(error))


  }
  onChangeTest(event1){ 
    event1.preventDefault();
    if(!this.ms.filterInputChild) return false
    let elemento = this.ms.filterInputChild.nativeElement.value 
    elemento = elemento.trim()
    if(elemento){
      let existe = this.etiquetasOpt.find(e=> (e.value.etiqueta).toLowerCase() === elemento.toLowerCase() )
      if(existe) return false
      let nuevaEtiqueta:Etiqueta = {etiqueta:elemento}
      this.etiquetasOpt.push({label:elemento,value:nuevaEtiqueta});

      if(typeof this.problemaForm.value['etiquetas'] === "string"){
          this.problemaForm.get('etiquetas').setValue([nuevaEtiqueta])
      } else {
          this.problemaForm.value['etiquetas'].push(nuevaEtiqueta)
      }
      
    }
    return false;
  }

  agregarSoluciones(solucines:Solucion[]){
    console.log(solucines)
    this.soluciones = solucines;
  }
  myUploader(event) {
    //event.files == files to upload
    console.log(event)
    let ArchivoASubir = event.srcElement.files[0];
    const nombreArchivo = `${Math.floor((Math.random() * 9999999) + 99999)}${ArchivoASubir.name}`;

    this.problemaForm.get('archivo').setValue(nombreArchivo);
    this.problemaForm.get('file').setValue(ArchivoASubir);

  }

  verDatos(){
    console.log(this.problemaForm.value)
    console.log(this.archivo)
  }

}
