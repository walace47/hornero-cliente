import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../shared/service/login.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {

  constructor(
    private _loginService:LoginService,
    ) { }

  ngOnInit() {
  }

 isLogin(){
    return this._loginService.isLogin()
  }

}
