import { Component, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SelectItem } from "primeng/api/selectitem";
import { MultiSelect } from "primeng/multiselect/public_api";
import { Problema } from "src/app/model/Problema";
import { Solucion } from "src/app/model/Solucion";
import { ComplejidadService } from "src/app/modules/torneo/services/complejidad.service";
import { Complejidad } from "src/app/model/Complejidad";
import { Etiqueta } from "src/app/model/Etiqueta";
import { EtiquetasService } from "src/app/modules/problema/services/etiqueta.service";
import { ArchivoService } from "src/app/modules/problema/services/archivo.service";
import { ProblemaService } from "src/app/modules/problema/services/problema.service";
import { NotifierService } from 'angular-notifier';

@Component({
  selector: "app-crear-problema",
  templateUrl: "./crear-problema.component.html",
  styleUrls: [`./crear-problema.component.css`],
  providers: [
    ComplejidadService,
    EtiquetasService,
    ArchivoService,
    ProblemaService,
  ],
})
export class CrearProblemaComponent implements OnInit {
  @ViewChild("ms") ms: MultiSelect;
  complejidades: SelectItem[] = [];
  complejidadSeleccionada: string[] = [];

  items: SelectItem[];
  item: string;

  public etiquetasOpt: SelectItem[] = [];
  private suscripciones: Subscription[] = [];
  public problemaForm: FormGroup;
  public submitted: boolean;
  public loading: boolean;
  public id: string;

  public soluciones: Solucion[];
  private esEdicion = false;
  public archivo: File;
  public problema: Problema;

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private complejidadService: ComplejidadService,
    private etiquetaService: EtiquetasService,
    private subirArchivoService: ArchivoService,
    private problemaService: ProblemaService,
    private notifier: NotifierService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.paramMap.get("id");
    this.complejidadService
      .getAll()
      .then(
        (complejidades: Complejidad[]) =>
          (this.complejidades = complejidades.map((e) => ({
            label: e.complejidad,
            value: e,
          })))
      )
      .catch((error) => console.log(error));

    this.problemaForm = this.fb.group({
      nombre: new FormControl("", Validators.required),
      archivo: new FormControl(""),
      file: new FormControl(""),
      enunciado: new FormControl("", Validators.required),
      complejidad: new FormControl("", Validators.required),
      tiempoEjecucion: new FormControl("", Validators.required),
      etiquetas: new FormControl(""),
    });

    this.etiquetaService
      .getAll()
      .then((etiquetas: Etiqueta[]) => {
        this.etiquetasOpt = etiquetas.map((e) => ({
          label: e.etiqueta,
          value: e,
        }));
      })
      .catch((error) => console.log(error));

    if (Number(this.id)) {
      this.esEdicion = true;
      this.problemaService
        .get(this.id, ["complejidad", "etiquetas", "soluciones"])
        .toPromise()
        .then((problema: Problema) => {
          console.log(problema);
          this.problema = problema;
          this.soluciones = problema.soluciones;
          this.problemaForm.controls["nombre"].setValue(problema.nombre);
          this.problemaForm.controls["archivo"].setValue(problema.archivo);
          this.problemaForm.controls["enunciado"].setValue(problema.enunciado);
          this.problemaForm.controls["complejidad"].setValue(problema.complejidad);
          this.problemaForm.controls["etiquetas"].setValue(problema.etiquetas);
          this.problemaForm.controls["tiempoEjecucion"].setValue(
            problema.tiempoEjecucionMax
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  onSubmit(problema: object) {
    let nuevoProblema: Problema = {
      nombre: this.problemaForm.value["nombre"],
      archivo: this.problemaForm.value["archivo"],
      enunciado: this.problemaForm.value["enunciado"],
      complejidad: this.problemaForm.value["complejidad"],
      tiempoEjecucionMax: this.problemaForm.value["tiempoEjecucion"],
      etiquetas: this.problemaForm.value["etiquetas"],
      soluciones: this.soluciones,
    };
    if (!this.esEdicion) {
      nuevoProblema.idProblema = this.problema.idProblema;
      console.log(this.problemaForm.value.file);
      this.subirArchivoService.subirArchivo(
          "problemas",
          this.problemaForm.value["archivo"],
          this.problemaForm.value["file"]
      )
        .then(res => console.log(res))
        .catch(error => console.log(error));
      this.problemaService.crear(nuevoProblema)
        .then((res) => {
          this.notifier.notify("success","Problema creado");
          this.router.navigate(["/problemas"]);
        })
        .catch((error) =>{
          console.log(error)
          this.notifier.notify("error","Ubo un error al crear el problema");
        });
      console.log(this.problemaForm);

 
    }else{
      nuevoProblema.idProblema = Number(this.id)
      this.problemaService.editar(nuevoProblema).toPromise()
        .then(()=> {
          this.notifier.notify("success","Problema editado");
          this.router.navigate(["/problemas"]);
        })
        .catch((error) => {
          console.log(error);
          this.notifier.notify("error","Ubo un error al editar el problema");

        })
      //implementar edicion
    }
  }

  onChangeTest(event1) {
    event1.preventDefault();
    if (!this.ms.filterInputChild) return false;
    let elemento = this.ms.filterInputChild.nativeElement.value;
    elemento = elemento.trim();
    if (elemento) {
      let existe = this.etiquetasOpt.find(
        (e) => e.value.etiqueta.toLowerCase() === elemento.toLowerCase()
      );
      if (existe) return false;
      let nuevaEtiqueta: Etiqueta = { etiqueta: elemento };
      this.etiquetasOpt.push({ label: elemento, value: nuevaEtiqueta });
      if (typeof this.problemaForm.value["etiquetas"] === "string") {
        this.problemaForm.get("etiquetas").setValue([nuevaEtiqueta]);
      } else {
        this.problemaForm.value["etiquetas"].push(nuevaEtiqueta);
      }
    }
    return false;
  }

  agregarSoluciones(solucines: Solucion[]) {
    console.log(solucines);
    this.soluciones = solucines;
  }
  myUploader(event) {
    //event.files == files to upload
    console.log(event);
    let ArchivoASubir = event.srcElement.files[0];
    const nombreArchivo = `${Math.floor(Math.random() * 9999999 + 99999)}${
      ArchivoASubir.name
    }`;

    this.problemaForm.get("archivo").setValue(nombreArchivo);
    this.problemaForm.get("file").setValue(ArchivoASubir);
  }

  verDatos() {
    console.log(this.problemaForm.value);
    console.log(this.archivo);
  }
}
