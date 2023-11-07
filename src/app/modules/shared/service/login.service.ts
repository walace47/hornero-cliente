import { Injectable } from "@angular/core";
import { LOGIN_STATES, UsuarioConectado } from '../../../model/Usuario';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ROLES } from "../../../model/Rol"
import { Torneo } from '../../../model/Torneo';
import { Observable, Subject, Subscriber } from "rxjs";
@Injectable({
    providedIn: "root"
})
export class LoginService {
    private url: string;
    private display: boolean;
    private loginStateObservable: Subject<string>;

    constructor(private http: HttpClient) {
        this.url = environment.url + "/login";
        this.loginStateObservable = new Subject();
        this.display = false;
    }
    getLoginState() {
        if (this.isAdmin()) return LOGIN_STATES.ADMIN
        if (this.isDocente()) return LOGIN_STATES.DOCENTE
        if (this.isLogin()) return LOGIN_STATES.ALUMNOS
        return LOGIN_STATES.PUBLICO;
    }

    getToken() {
        const usuario: UsuarioConectado = JSON.parse(localStorage.getItem("usuario"));
        return usuario;
    }
    mostrarLogin() {
        return this.display;
    }
    setDisplay(nuevoEstado: boolean) {
        this.display = nuevoEstado;
    }

    recuperarPass(email: string) {
        return this.http.post(this.url + "/recuperar-pass", { email }).toPromise();
    }

    getLoginStateObservable() {
        return this.loginStateObservable.asObservable();
    }

    notifyLoginHasChange() {
        this.loginStateObservable.next(this.getLoginState())
    }

    isLogin() {
        const usuario: UsuarioConectado = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario) return false;
        if (new Date(usuario.fechaFin) < (new Date())) {
            this.logout();
            return false;
        }
        return true;
    }



    esDuenio(torneo: Torneo) {
        const usuario: UsuarioConectado = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario) return false;
        if (new Date(usuario.fechaFin) < (new Date())) return false;
        if (!torneo.creador) return false;
        if (torneo.creador.idUsuario !== usuario.usuario.idUsuario) return false;
        return true;
    }

    getUsuario() {
        const usuario: UsuarioConectado = JSON.parse(localStorage.getItem("usuario"));

        if (usuario && usuario.token) {
            return usuario.token;
        } else {
            return "sdsadsad"
        }
    }

    getId() {
        const usuario: UsuarioConectado = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario) return null;
        return usuario.usuario.idUsuario
    }

    isAdmin() {
        const usuario: UsuarioConectado = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario) return false;
        if (new Date(usuario.fechaFin) < (new Date())) return false;
        if (usuario.usuario.rol.idRol !== ROLES.admin) return false;
        return true;
    }
    //El docente tiene privilegios mas limitados que el admin
    isDocente() {
        const usuario: UsuarioConectado = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario) return false;
        if (new Date(usuario.fechaFin) < (new Date())) return false;
        if (usuario.usuario.rol.idRol !== ROLES.docente && usuario.usuario.rol.idRol !== ROLES.admin) return false;
        return true;
    }

    login(usuario: string, pass: string) {
        return this.http.post(this.url, { usuario, pass })
    }

    logout() {
        localStorage.removeItem("usuario");
        this.loginStateObservable.next(this.getLoginState());
    }

}
