import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { LenguajesService } from 'src/app/modules/torneo/services/lenguajes.service';
import { Usuario } from '../../../../model/Usuario'
import { ROLES } from '../../../../model/Rol'
import { UsuarioService } from 'src/app/modules/usuario/services/usuario.service';
import { Subscription, firstValueFrom } from 'rxjs';
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

    public userform: UntypedFormGroup;
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
    public valorHeader: String = "Nuevo Usuario";

    public mensajesError = {
        nombreUsuario:"El usuario es obligatorio",
        institucion:"La institucion es obligatorio",
        email:"El email es obligatorio",
        password:"La contraseña es obligatoria",
        passwordRepetir:"Las contraseñas no coinciden",
        lenguaje:"El lenguaje es obligatorio",
        rol:"El rol es obligatorio"
    }

    constructor(
        private fb: UntypedFormBuilder,
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
            firstValueFrom(this.usuariosService.get(this.id, null, ['rol', 'lenguajeFavorito']))
                .then((usuario: Usuario) => {
                    this.usuarioEditando = usuario
                    this.valorHeader = "Editar " + usuario.nombreUsuario;
                    this.userform.controls['institucion'].setValue(usuario.institucion);
                    this.userform.controls['nombreUsuario'].setValue(usuario.nombreUsuario);
                    this.userform.controls['email'].setValue(usuario.email);
                    this.userform.controls['roles'].setValue(usuario.rol);
                    this.userform.controls['lenguajes'].setValue(usuario.lenguajeFavorito);
                })
                .catch(e => this.router.navigate(["/crear-usuario", 'nuevo']))
        }

        firstValueFrom(this.lenguajeService.getAll()).then((lng: Lenguaje[]) => {
            this.lenguajes = lng.map((elem: Lenguaje) => ({ label: elem.lenguaje, value: elem }))
            this.lenguajes.unshift({ label: "Elige un lenguaje", value: null })
        })


        firstValueFrom(this.rolService.getAll()).then((roles) => {
            if(!this.loginService.isAdmin()){
                roles = roles.filter(r => r.idRol !== ROLES.admin)
            }
            this.roles = roles.map(rol => ({ label: rol.rol, value: rol }));
            this.roles.unshift({ label: "Elige un rol", value: null });
        })

    }


    formConfig() {

        if (Number(this.id)) {
            this.userform = this.fb.group({
                'institucion': ['', Validators.required],
                'nombreUsuario': ['', Validators.compose([Validators.required])],
                'email': ['', Validators.compose([Validators.required, Validators.email])],
                'lenguajes': ['', Validators.required],
                'roles': ['',Validators.required],
            });
        } else {

            this.userform = this.fb.group({
                'institucion': ['', Validators.required],
                'nombreUsuario': ['', Validators.compose([Validators.required]), this.notRepeatUserName.bind(this)],
                'email': ['', Validators.compose([Validators.required, Validators.email]), this.notRepeateEmail.bind(this)],
                'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
                'passwordRepetir': ['', Validators.compose([Validators.required])],
                'lenguajes': ['', Validators.required],
                'roles': ['',Validators.required],
            }, {
                validators: [this.MustMatch('password', 'passwordRepetir')]
            });
        }
    }
    verDatos(){
        console.log(this.userform)
    }

    mostrarMensajeErrorNombreUsuario(){
        if(this.userform.controls['nombreUsuario'].dirty && this.userform.controls['nombreUsuario'].errors){
            if(this.userform.controls['nombreUsuario'].errors['usuarioExiste']){
                this.mensajesError.nombreUsuario = "El nombre de usuario esta en uso"
                return true;
            }
            if(this.userform.controls['nombreUsuario'].errors['required']){
                this.mensajesError.nombreUsuario = "El nombre de usuario es obligatorio"
                return true;
            }
        }
        return false;
    }

    mostrarMensajeErrorEmail(){
        if(this.userform.controls['email'].dirty && this.userform.controls['email'].errors){
            if(this.userform.controls['email'].errors['emailExiste']){
                this.mensajesError.email = "El email esta en uso"
                return true;
            }
            if(this.userform.controls["email"].errors['email']){
                this.mensajesError.email = "Porfavor introduzca un email valido"
                return true;
            }
            if(this.userform.controls['email'].errors['required']){
                this.mensajesError.email = "El email es obligatorio"
                return true;
            }
        }
        return false;
    }

    mostrarPasswordErrorEmail(){
        if(!this.userform.controls['password'].valid && this.userform.controls['password'].dirty){
            if(this.userform.controls['password'].errors['minlength']){
                this.mensajesError.password = "La password tiene que ser mayor a 6 caracteres";
                return true;
            }
            if(this.userform.controls['password'].errors['required']){
                this.mensajesError.password = "La password es obligatoria";
                return true;
            }
            return false
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

        if (this.editando) {

            const usuarioAeditar: Usuario = {
                institucion: value.institucion,
                nombreUsuario: value.nombreUsuario,
                lenguajeFavorito: value.lenguajes,
                email: value.email,
                descripcion: value.nombreUsuario,
                rol: value.rol || value.rolesCommonUser || { idRol: ROLES.jugador }
            }

            firstValueFrom(this.usuariosService.edit(this.id, usuarioAeditar)).then()
                .then(e => this.notifier.notify("success", "Usuario Modificado con exito"))
                .catch(e => this.notifier.notify("error", "Hubo un error al crear un usuario"))
                .finally(() => {
                    this.router.navigate(["/inicio"])
                    this.loading = false
                })
        } else {

            const nuevoUsuario: Usuario = {
                clave: value.password,
                institucion: value.institucion,
                nombreUsuario: value.nombreUsuario,
                lenguajeFavorito: value.lenguajes,
                email: value.email,
                descripcion: value.nombreUsuario,
                rol: value.rol || value.rolesCommonUser || { idRol: ROLES.jugador }
            }

            firstValueFrom(this.usuariosService.save(nuevoUsuario))
                .then(() => this.notifier.notify("success", "Usuario creado con exito"))
                .catch(() => this.notifier.notify("error", "Hubo un error al crear un usuario"))
                .finally(() => {
                    this.router.navigate(["/inicio"])
                    this.loading = false
                })
        }


    }


    MustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: UntypedFormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // return if another validator has already found an error on the matchingControl
                return null;
            }
            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
                return { mustMatch: true }
            } else {
                matchingControl.setErrors(null);
            }
        }
    }




    async notRepeatUserName(control: UntypedFormControl) {
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


    async notRepeatUserNameEditing(control: UntypedFormControl) {
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


    async notRepeateEmail(control: UntypedFormControl) {
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



