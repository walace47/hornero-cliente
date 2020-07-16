import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from 'src/app/modules/usuario/services/usuario.service';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/model/Usuario';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['usuario.components.css']
})
export class UsuariosComponent implements OnInit,OnDestroy {
  private suscripciones:Subscription[] = [];
  public usuarios:Usuario[];
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
      this._usuariosService.getAll(null,["rol"]).subscribe(usuarios => this.usuarios = usuarios )
    )
  }

  ngOnDestroy(){
    this.suscripciones.forEach(sub => sub.unsubscribe())
  }

}
