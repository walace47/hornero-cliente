import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Lenguaje } from 'src/app/model/Lenguaje';
import { Stub } from 'src/app/model/Stub';
import { ArchivoService } from 'src/app/modules/problema/services/archivo.service';
import { LoginService } from 'src/app/modules/shared/service/login.service';
import { LenguajesService } from 'src/app/modules/torneo/services/lenguajes.service';
import { StubsService } from '../../services/stubs.service';

@Component({
  selector: 'app-detalle-stub',
  templateUrl: './detalle-stub.component.html',
  styleUrls: ['./detalle-stub.component.css']
})
export class DetalleStubComponent implements OnInit {

  public stubForm: FormGroup;
  public submitted: boolean;
  public description: string;
  public loading: boolean
  public editando: boolean;
  public id: string;
  public stubEditando: Stub;
  public valorHeader: String = "Nuevo Stub";
  public archivoNombre = "";
  public suscripciones: Subscription[] = [];
  public lenguajes: Lenguaje[] = [];
  public lenguajesMostrados: String[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private lenguajeService: LenguajesService,
    private stubService: StubsService,
    private archivoService: ArchivoService,
    private loginService: LoginService,
    private activeRoute: ActivatedRoute,
    private notifier: NotifierService) {

    this.loading = false;
    this.editando = false;
  }

  ngOnInit() {
    this.suscripciones.push(this.activeRoute.paramMap.subscribe(params => {
      this.lenguajeService.getAll().toPromise()
        .then(e => {
          this.lenguajes = e;
        })
      this.id = this.activeRoute.snapshot.paramMap.get('id');

      this.formConfig();

      if (Number(this.id)) {
        this.editando = true;
        console.log(this.editando);
        this.stubService.get(this.id, ["lenguaje"]).toPromise()
          .then(
            (e: Stub) => {
              this.valorHeader = `Editando stub de ${e.lenguaje.lenguaje}`
              this.archivoNombre = e.archivo
              this.stubForm.get("lenguaje").setValue(e.lenguaje.lenguaje)
              this.stubForm.get("descripcion").setValue(e.descripcion)
              this.stubForm.get("archivo").setValue(e.archivo)

            })

      }
    }))
  }


  search(event) {
    let query:string = event.query;
    this.lenguajesMostrados = this.filterElement(query)

}

 filterElement(query:string){
  let result = [] ;
  this.lenguajes.forEach(l => {
    query = query.toLocaleLowerCase();
    const lenguajeAux = l.lenguaje.toLocaleLowerCase()
    if(lenguajeAux.includes(query)){
      result.push(l.lenguaje)
    }
  })
  console.log(result);
  return result;
 }

  ngOnDestroy(): void {
    this.suscripciones.forEach(e => e.unsubscribe())
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }

  myUploader(event) {
    let ArchivoASubir = event.srcElement.files[0];
    console.log(ArchivoASubir)
    this.archivoNombre = `${Math.floor(Math.random() * 9999999 + 99999)}${ArchivoASubir.name
      }`;

    this.stubForm.get("archivo").setValue(this.archivoNombre);
    this.stubForm.get("file").setValue(ArchivoASubir);
  }


  formConfig() {

    this.stubForm = this.fb.group({
      lenguaje: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      archivo: new FormControl('', Validators.required),
      file: new FormControl('')
    });

  }

  isLogin() {
    return this.loginService.isLogin();
  }
  isAdmin() {
    return this.loginService.isAdmin();
  }

  onSubmit(value: any) {


    this.loading = true;

    if (value["file"]) {
      this.archivoService.subirArchivo("stubs", value["archivo"], value["file"])
        .then((a) => {
          this.notifier.notify("success", "Archivo Subido con exito")
        })
        .catch((e) => {
          this.notifier.notify("error", "Error al subir archivo")
        })

    }

    if (this.editando) {
      let stubAEditar: Stub = {
        idStubs: Number(this.id),
        archivo: value['archivo'],
        descripcion: value['descripcion'],
      }
      this.stubService.edit(stubAEditar).toPromise()
        .then((e) => {
          this.notifier.notify("success", "Stub Modificado con exito")
          this.router.navigate(["/stubs"])

        })
        .catch((e) => {
          this.notifier.notify("error", "Error al crear el stub")

        })
        .finally(() => this.loading = false)
    } else {
      let nuevoStub: Stub = {
        lenguaje: value['lenguaje'],
        archivo: value['archivo'],
        descripcion: value['descripcion'],

      }
      this.stubService.create(nuevoStub).toPromise()
        .then((e) => {
          this.notifier.notify("success", "stub creado con exito")
          this.router.navigate(["/stubs"])
        })
        .catch((e) => {
          this.notifier.notify("error", "Error al crear el stub")

        })
        .finally(() => this.loading = false)
    }
  }














}
