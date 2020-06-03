import { Component, OnInit } from '@angular/core';
import { CodigoUsuarioService } from 'src/app/services/codigo-usuario.service';

@Component({
  selector: 'app-codigo-usuario',
  templateUrl: './codigo-usuario.component.html',
  styleUrls: ['./codigo-usuario.component.css'],
  providers:[]
})
export class CodigoUsuarioComponent implements OnInit {
  public test:string[] = [];
  constructor() { 

    for (let i = 0; i < 500; i++){
      this.test.push("1")
    }
  }
  doubleClick(){
    console.log("hola mundo")
  }

  achicarTexto(texto){
    return texto.substring(0, 10) + "...";

  }


  ngOnInit(): void {
  }

}
