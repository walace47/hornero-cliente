import { Component, OnInit, Input } from '@angular/core';
import { CodigoUsuarioService } from 'src/app/services/codigo-usuario.service';

@Component({
  selector: 'app-codigo-usuario',
  templateUrl: './codigo-usuario.component.html',
  styleUrls: ['./codigo-usuario.component.css'],
  providers:[]
})
export class CodigoUsuarioComponent implements OnInit {
  @Input() public codigos:string[] = [];
  constructor() { 
    

  }
  doubleClick(codigo){
    console.log(codigo)
  }

  achicarTexto(texto:string){
    if(texto.length < 10){
      return texto
    }else{
      return texto.substring(0, 10) + "...";

    }

  }


  ngOnInit(): void {
  }

}
