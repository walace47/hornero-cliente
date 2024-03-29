import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { LenguajesService } from 'src/app/modules/torneo/services/lenguajes.service';
import { Usuario } from '../../../../model/Usuario'
import { ROLES } from '../../../../model/Rol'
import { UsuarioService } from 'src/app/modules/usuario/services/usuario.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RolService } from 'src/app/modules/usuario/services/rol.service';
import { LoginService } from 'src/app/modules/shared/service/login.service';
import { Lenguaje } from 'src/app/model/Lenguaje';
import { NotifierService } from "angular-notifier"

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css'],
  providers: [
    LenguajesService,
    RolService,
    LoginService,
    NotifierService
  ]
})
export class CrearUsuarioComponent implements OnInit, OnDestroy {

  public userform: FormGroup;
  public submitted: boolean;
  public lenguajes: SelectItem[];
  public description: string;
  public usuarios: Usuario[]
  public loading: boolean
  private suscripciones: Subscription[] = [];
  public roles: SelectItem[];
  public rolesCommonUser: SelectItem[] = [];
  public editando: boolean = false;
  public id: string;
  public usuarioEditando: Usuario;
  public valorHeader:String = "Nuevo Usuario";
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private lenguajeService: LenguajesService,
    private usuariosService: UsuarioService,
    private router: Router,
    private rolService: RolService,
    private loginService: LoginService,
    private activeRoute: ActivatedRoute,
    private notifier: NotifierService) {

    this.loading = false;
    this.lenguajes = [];
    this.roles = [];
    this.editando = false;
  }

  ngOnInit() {

    this.id = this.activeRoute.snapshot.paramMap.get('id');
    this.formConfig();


    if (Number(this.id)) {
      this.editando = true;
      console.log(this.editando);
      this.usuariosService.get(this.id, null, ['rol', 'lenguajeFavorito']).toPromise()
        .then((usuario: Usuario) => {
          console.log(usuario);
          this.valorHeader = "Editar " + usuario.nombreUsuario;
          this.usuarioEditando = usuario
          this.userform.controls['institucion'].setValue(usuario.institucion);
          this.userform.controls['nombreUsuario'].setValue(usuario.nombreUsuario);
          this.userform.controls['email'].setValue(usuario.email);
          this.userform.controls['roles'].setValue(usuario.rol);
          this.userform.controls['rolesCommonUser'].setValue(usuario.rol);
          this.userform.controls['lenguajes'].setValue(usuario.lenguajeFavorito);
          

        })
        .catch(e => {
          this.router.navigate(["/usuarios"])

        })
    }

    this.suscripciones.push(
      this.lenguajeService.getAll().subscribe((lng: Lenguaje[]) => {
        this.lenguajes = lng.map((elem: Lenguaje) => ({ label: elem.lenguaje, value: elem }))
        this.lenguajes.unshift({ label: "Elige un lenguaje", value: null })
      }))

    this.suscripciones.push(
      this.rolService.getAll().subscribe((roles) => {

        this.roles = roles.map(rol => ({ label: rol.rol, value: rol }));
        this.rolesCommonUser = this.roles.filter((e: SelectItem) => e.value.idRol !== ROLES.admin)

        this.roles.unshift({ label: "Elige un rol", value: null });
        this.rolesCommonUser.unshift({ label: "Elige un rol", value: null });

      }))

  }


  formConfig() {

    if(Number(this.id)){
      this.userform = this.fb.group({
        'institucion': new FormControl('', Validators.required),
        'nombreUsuario': new FormControl('', Validators.compose([Validators.required])),
        'email': new FormControl('', Validators.compose([Validators.required, Validators.email])),
        'lenguajes': new FormControl('', Validators.required),
        'roles': new FormControl(''),
        'rolesCommonUser': new FormControl('')
      });
    }else{

      this.userform = this.fb.group({
        'institucion': new FormControl('', Validators.required),
        'nombreUsuario': new FormControl('', Validators.compose([Validators.required]), this.notRepeatUserName.bind(this)),
        'email': new FormControl('', Validators.compose([Validators.required, Validators.email]), this.notRepeateEmail.bind(this)),
        'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
        'passwordRepetir': new FormControl('', Validators.compose([Validators.required])),
        'lenguajes': new FormControl('', Validators.required),
        'roles': new FormControl(''),
        'rolesCommonUser': new FormControl('')
      },
      {
        validator: [this.MustMatch('password', 'passwordRepetir')]
      });
    }
  }

  isLogin() {
    return this.loginService.isLogin();
  }
  isAdmin() {
    return this.loginService.isAdmin();
  }

  onSubmit(value: any) {
    this.submitted = true;
    this.loading = true;

    if(this.editando){

      const usuarioAeditar: Usuario = {
        institucion: value.institucion,
        nombreUsuario: value.nombreUsuario,
        lenguajeFavorito: value.lenguajes,
        email: value.email,
        descripcion: value.nombreUsuario,
        rol: value.rol || value.rolesCommonUser || { idRol: ROLES.jugador }
      }
      this.usuariosService.edit(this.id,usuarioAeditar).toPromise()
        .then((e)=>{
          this.notifier.notify("success", "Usuario Modificado con exito")
        }).catch(e => {
          this.notifier.notify("error", "Ubo un error al crear un usuario")

        })
        .finally( () => {
          this.router.navigate(["/inicio"])
          this.loading = false
        })
    }else{

      const nuevoUsuario: Usuario = {
        clave: value.password,
        institucion: value.institucion,
        nombreUsuario: value.nombreUsuario,
        lenguajeFavorito: value.lenguajes,
        email: value.email,
        descripcion: value.nombreUsuario,
        rol: value.rol || value.rolesCommonUser || { idRol: ROLES.jugador }
      }

      this.suscripciones.push(
        this.usuariosService.save(nuevoUsuario).subscribe(
          () => {
            this.notifier.notify("success", "Usuario creado con exito")
            this.router.navigate(["/inicio"])
            this.loading = false
          },
          () => {
            this.notifier.notify("error", "Ubo un error al crear un usuario")
            this.router.navigate(["/inicio"])
            this.loading = false
          }))
        }
        
      }
        
        
        MustMatch(controlName: string, matchingControlName: string) {
          return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }




  async notRepeatUserName(control: FormControl) {
    const suscribe = this.usuariosService.existeUsuario(control.value).subscribe((res: any) => {
      if (res.estaEnUso) {
        control.setErrors({ usuarioExiste: true })
      } else {
        control.setErrors(null)
      }
    })
    this.suscripciones.push(suscribe)
    return suscribe;

  }


  async notRepeatUserNameEditing(control: FormControl) {
    const suscribe = this.usuariosService.existeUsuario(control.value).subscribe((res: any) => {
      if (res.estaEnUso) {
        control.setErrors({ usuarioExiste: true })
      } else {
        control.setErrors(null)
      }
    })
    this.suscripciones.push(suscribe)
    return suscribe;

  }


  async notRepeateEmail(control: FormControl) {
    const suscribe = this.usuariosService.existeEmail(control.value).subscribe((res: any) => {
      if (res.estaEnUso) {
        control.setErrors({ emailExiste: true })

      } else {
        control.setErrors(null)
      }
    })
    this.suscripciones.push(suscribe);
    return suscribe;
  }

  ngOnDestroy() {
    this.suscripciones.forEach(sub => sub.unsubscribe())
  }

}



