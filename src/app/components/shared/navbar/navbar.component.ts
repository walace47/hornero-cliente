import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public display:boolean
  constructor(public loginService:LoginService) { 
    this.display = false;
  }

  ngOnInit() {
  }

  mostrarLogin(){
    this.display = true;
    this.loginService.setDisplay(true)

  }
  cerrarDisplay(mensaje:string){
    this.display = false
    this.loginService.setDisplay(false)
  }

}
