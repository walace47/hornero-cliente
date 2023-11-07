import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { LoginService } from '../../shared/service/login.service';
import { UsuarioConectado } from 'src/app/model/Usuario';
@Injectable({
    providedIn: "root"
})
export class AuthGuardUsuarioService {
    constructor(public auth: LoginService, public router: Router) { }


    canActivate(route: ActivatedRouteSnapshot): boolean {
        let idUsuario = route.paramMap.get('id');
        let pasoAuth: boolean = false
        const usuario: UsuarioConectado = JSON.parse(localStorage.getItem("usuario"));
        if (Number(idUsuario)) {
            if (usuario.usuario.idUsuario === Number(idUsuario)) {
                return true;
            }
        } else if (idUsuario === 'nuevo') {
            return true;
        }

        pasoAuth = this.auth.isAdmin()
        if (!pasoAuth) {
            this.router.navigate(['/inicio']);
            return false;
        }
        return true;
    }
}
