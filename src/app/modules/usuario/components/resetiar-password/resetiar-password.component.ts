import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-resetiar-password',
  templateUrl: './resetiar-password.component.html',
})
export class ResetiarPasswordComponent implements OnInit {
  public hash:string;
  public userform: UntypedFormGroup;
  public mostrarPass:boolean = false;
  public mostrarPassRepe:boolean = false;
  public loading:boolean = false;


  constructor(
    private activeRoute:ActivatedRoute,
    private fb: UntypedFormBuilder, 
    private _userService: UsuarioService,
    private notifier:NotifierService,
    private router: Router,

    ) {
  }

  ngOnInit(): void {
    this.hash = this.activeRoute.snapshot.paramMap.get('hash');
    this.formConfig()
  }

  onSubmit(value: any){
    this.loading = true;
    this._userService.actualizarContrasenia(this.hash,value.password)
      .then(()=>{
        this.notifier.notify("success","Contrasenia modificada con exito")
        this.router.navigate(["/inicio"])
      })
      .catch((error) => {
        this.notifier.notify("error","Ubo un error al modificar la constrasenia")
        console.log(error)
      })
      .finally(()=>this.loading = false)

  }

  formConfig(){
    this.userform = this.fb.group({
      'password': new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      'passwordRepetir': new UntypedFormControl('',Validators.compose([Validators.required])),
    },
    {
      validator: [this.MustMatch('password', 'passwordRepetir')]
    });
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: UntypedFormGroup) => {
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

}
