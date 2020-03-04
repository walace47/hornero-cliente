import { Component, OnInit, OnDestroy } from '@angular/core';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import {MessageService} from 'primeng/api';
import { LenguajesService } from 'src/app/services/lenguajes.service';
import {usuario} from '../../../../model/usuario' 
import { UsuarioService } from 'src/app/services/usuario.service';
import {  Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RolService } from 'src/app/services/rol.service';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css'],
  providers:[ 
      MessageService,
      LenguajesService,
      RolService,
      LoginService
    ]
})
export class CrearUsuarioComponent implements OnInit, OnDestroy {

  public userform: FormGroup;
  public submitted: boolean;
  public lenguajes: SelectItem[];
  public description: string;
  public usuarios:usuario[]
  public loading:boolean
  private suscripciones:Subscription[] = [];
  public roles:SelectItem[];
  public editando:boolean;
  public id:string;
  public usuarioEditando:usuario;

  constructor(
    private fb: FormBuilder, 
    private messageService: MessageService, 
    private lenguajeService:LenguajesService,
    private usuariosService:UsuarioService,
    private router: Router,
    private rolService:RolService,
    private loginService:LoginService,
    private activeRoute:ActivatedRoute){

      this.formConfig();
      this.loading = false;
      this.lenguajes = [];
      this.roles = [];
      this.editando = false;
    }

  ngOnInit() {

    this.id = this.activeRoute.snapshot.paramMap.get('id');

    this.suscripciones.push(
      this.lenguajeService.getAll().subscribe(lng => {
        this.lenguajes = lng.map(elem => {return {label:elem.Lenguaje, value:elem}})
        this.lenguajes.unshift({label:"Elige un lenguaje", value:null}) 
      }))

      this.suscripciones.push(
        this.rolService.getAll().subscribe((roles)=>{
          this.roles = roles.map(rol => ({label:rol.Rol, value:rol}));
          this.roles.unshift({label:"Elige un rol",value:null})
        }))

    if(Number(this.id)){
      this.editando = true;
      this.suscripciones.push(
        this.usuariosService.get(this.id).subscribe((usuario)=> this.usuarioEditando = usuario)
      )
    }
  }


  formConfig(){
    this.userform = this.fb.group({
      'institucion': new FormControl('', Validators.required),
      'nombreUsuario': new FormControl('', Validators.compose([Validators.required]),this.notRepeatUserName.bind(this)),
      'email': new FormControl('', Validators.compose([Validators.required,Validators.email]),this.notRepeateEmail.bind(this)),
      'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      'passwordRepetir': new FormControl('',Validators.compose([Validators.required])),
      'lenguajes': new FormControl('', Validators.required),
      'roles': new FormControl('')
    },
    {
      validator: [this.MustMatch('password', 'passwordRepetir')]
    });
  }

  isLogin(){
    return this.loginService.isLogin();
  }

  onSubmit(value: any) {
      this.submitted = true;
      this.loading = true;
      const nuevoUsuario:usuario = {
        Clave:value.password,
        Institucion:value.institucion,
        NombreUsuario:value.nombreUsuario,
        idLenguaje:value.lenguajes,
        Email:value.email,
        Descripcion: value.nombreUsuario,
        idRol: value.rol || {idRol:2}
      }
      this.suscripciones.push(
        this.usuariosService.save(nuevoUsuario).subscribe(
          () => {
              this.messageService.add({severity:'info', summary:'Success', detail:'Usuario creado con exito'});
              setTimeout( ()=> this.router.navigate(["/inicio"]),2000 )
              this.loading = false
          },
          () =>{
            this.messageService.add({severity:'error', summary:'error', detail:'Error al crear el usuario'});
            this.loading = false
          }))
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
  const suscribe = this.usuariosService.existeUsuario(control.value).subscribe( (res:any) =>{
    if(res.estaEnUso) {
      control.setErrors({usuarioExiste:true})
    } else {
      control.setErrors(null)
    }
  })
  this.suscripciones.push(suscribe)
  return suscribe;

}


  async notRepeateEmail(control: FormControl) {
    const suscribe = this.usuariosService.existeEmail(control.value).subscribe( (res:any) =>{
      if(res.estaEnUso){
        control.setErrors({emailExiste:true})

      }else{
        control.setErrors(null)
      }
    })
    this.suscripciones.push(suscribe);
    return suscribe;
  }

  ngOnDestroy(){
    this.suscripciones.forEach(sub => sub.unsubscribe())
  }

}



