import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from './components/lista-usuarios/usuarios.component';
import { AuthGuardService } from 'src/app/modules/utiles/services/guards.service';
import { AuthGuardUsuarioService } from 'src/app/modules/utiles/services/guards.duenio.service';
import { ROLES } from 'src/app/model/Rol';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';
import { ResetiarPasswordComponent } from './components/resetiar-password/resetiar-password.component';


const routes: Routes = [
  { path:"usuarios", component:UsuariosComponent,canActivate : [AuthGuardService],data:{rol:ROLES.admin} },
  { path: "crear-usuario/:id", component: CrearUsuarioComponent,canActivate : [AuthGuardUsuarioService]},
  { path: "resetear-password/:hash", component: ResetiarPasswordComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
