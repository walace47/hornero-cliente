import { Component, OnInit, ViewChild } from "@angular/core";
import { Subscription, firstValueFrom } from "rxjs";
import {
    UntypedFormGroup,
    UntypedFormBuilder,
    Validators,
    UntypedFormControl,
    FormControl
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
import { FileUpload } from "primeng/fileupload";

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
    @ViewChild('fileUpload') fileUpload: FileUpload;
    complejidades: SelectItem[] = [];
    complejidadSeleccionada: string[] = [];

    items: SelectItem[];
    item: string;

    public etiquetasOpt: SelectItem[] = [];
    public problemaForm: UntypedFormGroup;
    public submitted: boolean;
    public loading: boolean;
    public id: string;

    public soluciones: Solucion[];
    private esEdicion = false;
    public archivo: File;
    public problema: Problema;
    public fileControl: any;

    constructor(
        private fb: UntypedFormBuilder,
        private activeRoute: ActivatedRoute,
        private complejidadService: ComplejidadService,
        private etiquetaService: EtiquetasService,
        private subirArchivoService: ArchivoService,
        private problemaService: ProblemaService,
        private notifier: NotifierService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.id = this.activeRoute.snapshot.paramMap.get("id");
        this.complejidadService.getAll()
            .then((complejidades: Complejidad[]) => this.complejidades = complejidades.map((e) => ({
                label: e.complejidad,
                value: e,
            })))
            .catch((error) => console.log(error));

        this.problemaForm = this.fb.group({
            nombre: new UntypedFormControl("", Validators.required),
            archivo: new UntypedFormControl(""),
            file: new FormControl(),
            enunciado: new UntypedFormControl("", Validators.required),
            complejidad: new UntypedFormControl("", Validators.required),
            tiempoEjecucion: new UntypedFormControl("", Validators.required),
            etiquetas: new UntypedFormControl(""),
        });
        this.soluciones = []

        this.etiquetaService
            .getAll()
            .then((etiquetas: Etiqueta[]) => this.etiquetasOpt = etiquetas.map((e) => ({
                label: e.etiqueta,
                value: e,
            })))
            .catch((error) => console.log(error));

        if (Number(this.id)) {
            this.esEdicion = true;
            firstValueFrom(this.problemaService.get(this.id, ["complejidad", "etiquetas", "soluciones"]))
                .then((problema: Problema) => {
                    this.problema = problema;
                    this.soluciones = problema.soluciones;

                    if (problema.archivo) {

                        this.createFile(problema.archivo).then((file) => {
                            this.fileUpload.files = [file];
                            this.fileUpload.upload()
                            this.problemaForm.controls["file"].setValue(file)

                        })
                    }
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
                    console.log(error)
                    this.notifier.notify("error", "Hubo un error al buscar el problema " + this.id);
                    this.router.navigate(["/problemas"]);
                });
        }
    }


    async createFile(nameFile: string) {
        let response = await this.subirArchivoService.obtenerArchivo(nameFile).catch(e => console.log(e)) as Blob

        let metadata = {
            type: response.type
        };
        let file = new File([response], nameFile, metadata);
        return file
        // ... do something with the file or return it
    }

    onSubmit() {

        let nuevoProblema: any = { ...this.problemaForm.value }
        delete nuevoProblema?.file
        nuevoProblema.soluciones = this.soluciones

        this.subirArchivoService.subirArchivo(
            "problemas",
            this.problemaForm.value["archivo"],
            this.problemaForm.value["file"]
        )
            .catch(error => console.log(error));
        if (!this.esEdicion) {

            this.problemaService.crear(nuevoProblema as Problema)
                .then(() => {
                    this.notifier.notify("success", "Problema creado");
                    this.router.navigate(["/problemas"]);
                })
                .catch((error) => {
                    console.error(error)
                    this.notifier.notify("error", "Hubo un error al crear el problema");
                })


        } else {
            nuevoProblema.idProblema = Number(this.id)


            firstValueFrom(this.problemaService.editar(nuevoProblema as Problema))
                .then(() => {
                    this.notifier.notify("success", "Problema editado");
                    this.router.navigate(["/problemas"]);
                })
                .catch((error) => {
                    console.log(error);
                    this.notifier.notify("error", "Hubo un error al editar el problema");

                })
        }
    }

    onChangeEtiquetas(event1) {
        if (event1.preventDefault) event1.preventDefault()

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
        this.soluciones = solucines;
    }
    myUploader(event) {
        console.log(event)
        let archivoASubir: File = event.files[0];
        const nombreArchivo = `${Math.floor(Math.random() * 9999999 + 99999)}${archivoASubir.name.replace(' ', '')}`;

        this.problemaForm.get("archivo").setValue(nombreArchivo);
        this.problemaForm.get("file").setValue(archivoASubir);
    }

    verDatos() {
        console.log(this.problemaForm.value);
        console.log(this.archivo);
    }
}
