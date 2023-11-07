import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoginService } from 'src/app/modules/shared/service/login.service';
import { UsuarioConectado } from 'src/app/model/Usuario';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public mostrar: boolean;
    public usuario: string;
    public pass: string;
    public email: string;
    public error: boolean;
    @Input("display") public display: boolean
    @Output() displayChange = new EventEmitter();
    public loading = false;
    public recuperarContrasenia = false;


    constructor(
        private loginService: LoginService,
        private notifier: NotifierService,
    ) {
        this.error = false
        this.mostrar = false
    }

    recuperarPassword() {
        this.loading = true;
        this.loginService.recuperarPass(this.email)
            .then(() => this.notifier.notify('info', "Revise su casilla de correo"))
            .catch(error => {
                console.log(error)
                this.notifier.notify('error', "hubo un error con el servidor")
            })
            .finally(() => this.loading = false)
    }

    recuperarContraseniaClick() {
        this.error = false;
        this.recuperarContrasenia = true;
    }

    ngOnInit(): void {

    }

    conectar() {
        this.loading = true;

        this.loginService.login(this.usuario, this.pass).subscribe(
            (usuario: UsuarioConectado) => {
                this.error = false
                localStorage.setItem("usuario", JSON.stringify(usuario));
                this.loading = false;
                this.display = false
                this.loginService.notifyLoginHasChange()
            },
            error => {
                this.loading = false;
                this.error = true;
            }
        )
        this.pass = "";
    }
    onShow(){
    }
    onHide() {
        this.displayChange.emit("false");
        this.recuperarContrasenia = false;

    }

    ngOnChanges() {
        this.display = this.display;
    }
}
