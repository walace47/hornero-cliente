import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/modules/utiles/services/guards.service';
import { ROLES } from 'src/app/model/Rol';
import { StubsComponent} from './components/stubs/stubs.component';
import { DetalleStubComponent } from './components/detalle-stub/detalle-stub.component';


const routes: Routes = [
  { path: "stub/:id", component: DetalleStubComponent,canActivate : [AuthGuardService],data:{rol:ROLES.admin} },
    { path: "stubs", component: StubsComponent,canActivate : [AuthGuardService],data:{rol:ROLES.jugador} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TorneoRoutingModule { }
