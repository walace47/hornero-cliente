import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { LoginService } from './login.service';
import {ROLES} from "../model/Rol" 
@Injectable({
    providedIn:"root"
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: LoginService, public router: Router) {}
  
  
  canActivate(route:ActivatedRouteSnapshot): boolean {
    const rolEsperado = route.data.rol;
    let pasoAuth:boolean = false
    switch(rolEsperado){
        case ROLES.admin:{
            pasoAuth = this.auth.isAdmin();
            break;
        }
        case ROLES.docente:{
            pasoAuth = this.auth.isDocente();
            break;
        }
        case ROLES.jugador:{
            pasoAuth = this.auth.isLogin();
            if(!pasoAuth) 
                this.auth.mostrarLogin();
            break;
        }
    }
    if (!pasoAuth) {
        
        this.router.navigate(['inicio']);

        return false;
    }
    return true;
  }
}
