import { Component ,OnInit, Input, Output,EventEmitter } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioConectado } from 'src/app/model/Usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls:['./login.component.css']
})
export class LoginComponent implements OnInit {
  public mostrar:boolean;
  public usuario:string;
  public pass:string;
  public error:boolean;
  @Input("display") public display:boolean
  @Output() displayChange = new EventEmitter();


  constructor(private loginService:LoginService) {
    this.error = false
    this.mostrar = false
   }

  ngOnInit(): void {
  }

  conectar(){
    this.loginService.login(this.usuario,this.pass).subscribe(
      (usuario:UsuarioConectado) => {
        this.error = false
        localStorage.setItem("usuario",JSON.stringify(usuario));
        location.reload();
        this.display = false
      },
      error => this.error = true
    )
      this.usuario = "";
      this.pass = "";
  }
  onHide(){
    this.displayChange.emit("false");
    console.log(this.display)
  }
  ngOnChanges() {
    this.display = this.display;
  }
}
