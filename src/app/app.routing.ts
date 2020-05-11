import { RouterModule, Routes } from "@angular/router";
import { InicioComponent } from "./components/paginas/inicio/inicio.component";
import { AboutComponent } from "./components/paginas/about/about.component";
import { TorneosComponent } from './components/paginas/torneos/torneos.component';
import { TorneoDetalleComponent } from './components/paginas/torneos/torneo-detalle/torneo-detalle.component';
import { CrearUsuarioComponent } from './components/paginas/usuarios/crear-usuario/crear-usuario.component';

import { CrearTorneoComponent} from './components/paginas/torneos/crear-torneo/crear-torneo.component'
import { CrearProblemaComponent } from './components/paginas/problemas/crear-problema/crear-problema.component';
import { StubsComponent } from './components/paginas/stubs/stubs.component';
import { UsuariosComponent } from './components/paginas/usuarios/usuarios.component';
import { SwapComponent } from './components/paginas/blockly/swap/swap.component';
import { AuthGuardService } from "./services/guards.service"
import { ROLES } from "./model/Rol";
import { ProblemasComponent } from './components/paginas/problemas/problemas.component';
const routes: Routes = [
  { path: "inicio", component: InicioComponent },
  { path: "about", component: AboutComponent },
  { path:"stubs", component:StubsComponent, canActivate : [AuthGuardService],data:{rol:ROLES.jugador} },
  { path:"usuarios", component:UsuariosComponent,canActivate : [AuthGuardService],data:{rol:ROLES.admin} },
  { path: "torneos", component: TorneosComponent },
  { path: "problemas", component: ProblemasComponent },
  { path: "bloques/:idTorneo/:idToken", component:SwapComponent,canActivate : [AuthGuardService],data:{rol:ROLES.jugador}},
  { path: "crear-usuario/:id", component: CrearUsuarioComponent },
  { path: "crear-torneo/:id", component: CrearTorneoComponent,canActivate : [AuthGuardService],data:{rol:ROLES.docente} },
  { path: "crear-problema/:id", component: CrearProblemaComponent,canActivate : [AuthGuardService],data:{rol:ROLES.docente} },
  { path: "torneos/:id", component: TorneoDetalleComponent },
  { path: "**", pathMatch: "full", redirectTo: "/inicio" }
];

export const appRouting = RouterModule.forRoot(routes,{useHash:true});
