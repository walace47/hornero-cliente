import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Subscription } from 'rxjs';
import { usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['usuario.components.css']
})
export class UsuariosComponent implements OnInit,OnDestroy {
  private suscripciones:Subscription[] = [];
  public usuarios:usuario[];
  public cols: any[];

  constructor(private _usuariosService:UsuarioService) { }

  ngOnInit(): void {

    this.cols = [
      { field: 'Id', header: 'Vin', width: '5%'},
      { field: 'Nombre', header: 'Year', width: '15%' },
      { field: 'Institucion', header: 'Brand', width: '20%' },
      { field: 'Email', header: 'Color', width: '25%' },
      { field: 'Rol', header: 'Color', width: '10%' },
      { field: 'Acciones', header: 'Color', width: '10%' },

  ];
    this.suscripciones.push(
    this._usuariosService.getAll(null,["idRol"]).subscribe(usuarios => {this.usuarios = usuarios; console.log(usuarios)}))
  }

  ngOnDestroy(){
    this.suscripciones.forEach(sub => sub.unsubscribe())
  }

}
