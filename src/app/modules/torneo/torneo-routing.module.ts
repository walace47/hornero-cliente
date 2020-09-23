import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/modules/utiles/services/guards.service';
import { ROLES } from 'src/app/model/Rol';
import { TorneosComponent } from './components/lista-torneos/torneos.component';
import { CrearTorneoComponent } from './components/crear-torneo/crear-torneo.component';
import { TorneoDetalleComponent } from './components/torneo-detalle/torneo-detalle.component';
import { HornereandoComponent } from './components/hornereando/hornereando.component';


const routes: Routes = [
    { path: "torneos", component: TorneosComponent },
    { path: "crear-torneo/:id", component: CrearTorneoComponent,canActivate : [AuthGuardService],data:{rol:ROLES.docente} },
    { path: "torneos/:id", component: TorneoDetalleComponent },
    { path: "hornereando/:id/:token", component: HornereandoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TorneoRoutingModule { }
