import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProblemasComponent } from './components/listar-problemas/problemas.component';
import { CrearProblemaComponent } from './components/crear-problema/crear-problema.component';
import { AuthGuardService } from 'src/app/modules/utiles/services/guards.service';
import { ROLES } from 'src/app/model/Rol';


const routes: Routes = [
  { path: "problemas", component: ProblemasComponent },
  { path: "crear-problema/:id", component: CrearProblemaComponent,canActivate : [AuthGuardService],data:{rol:ROLES.docente} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProblemaRoutingModule { }
