import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {

  constructor(
    private _loginService:LoginService,
    private _usuarioService:UsuarioService
    ) { }

  ngOnInit() {
  }

 isLogin(){
    return this._loginService.isLogin()
  }

}
