import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';
import { UsuariosComponent } from './components/lista-usuarios/usuarios.component';
import { UsuarioService } from 'src/app/modules/usuario/services/usuario.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorTokenService } from 'src/app/modules/utiles/services/interceptor-token.service';


@NgModule({
  declarations: [
    CrearUsuarioComponent,
    UsuariosComponent],
  imports: [    
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    UsuarioRoutingModule,
    PrimengModule
  ],
  providers:[
  ]
})
export class UsuarioModule { }
