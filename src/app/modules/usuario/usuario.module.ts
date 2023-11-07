import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';
import { UsuariosComponent } from './components/lista-usuarios/usuarios.component';
import { ResetiarPasswordComponent } from './components/resetiar-password/resetiar-password.component';


@NgModule({
  declarations: [
    CrearUsuarioComponent,
    UsuariosComponent,
    ResetiarPasswordComponent],
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
