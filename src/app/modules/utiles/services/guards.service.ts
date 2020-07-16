import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { LoginService } from '../../shared/service/login.service';
import {ROLES} from "../../../model/Rol" 
@Injectable({
    providedIn:"root"
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: LoginService, public router: Router) {}
  
  
  canActivate(route:ActivatedRouteSnapshot): boolean {
    const rolEsperado = route.data.rol;
    console.log(route)
    let pasoAuth:boolean = false
    switch(rolEsperado){
        case ROLES.admin:{
            pasoAuth = this.auth.isAdmin();
            if(!pasoAuth) 
                this.auth.setDisplay(true);
            return true
            break;
        }
        case ROLES.docente:{
            pasoAuth = this.auth.isDocente();
            if(!pasoAuth) 
                this.auth.setDisplay(true);
            return true
            break;
        }
        case ROLES.jugador:{
            pasoAuth = this.auth.isLogin();
            console.log(pasoAuth);
            if(!pasoAuth) 
                this.auth.setDisplay(true);
                return true
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
