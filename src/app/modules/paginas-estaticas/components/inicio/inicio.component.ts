import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../shared/service/login.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {

    constructor(
        private _loginService: LoginService,
        private router: Router

    ) { }

    ngOnInit() {
    }
    onEmpezarClick(){
        this.router.navigate(['/crear-usuario','nuevo'])
    }

    isLogin() {
        return this._loginService.isLogin()
    }

}
