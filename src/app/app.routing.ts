import { RouterModule, Routes } from "@angular/router";
import { InicioComponent } from "./components/paginas/inicio/inicio.component";
import { AboutComponent } from "./components/paginas/about/about.component";
import { TorneosComponent } from './components/paginas/torneos/torneos.component';
import { TorneoDetalleComponent } from './components/paginas/torneos/torneo-detalle/torneo-detalle.component';
import { CrearUsuarioComponent } from './components/paginas/usuarios/crear-usuario/crear-usuario.component';

import {CrearTorneoComponent} from './components/paginas/torneos/crear-torneo/crear-torneo.component'
import { CrearProblemaComponent } from './components/paginas/problemas/crear-problema/crear-problema.component';
import { StubsComponent } from './components/paginas/stubs/stubs.component';
import { UsuariosComponent } from './components/paginas/usuarios/usuarios.component';

const routes: Routes = [
  { path: "inicio", component: InicioComponent },
  { path: "about", component: AboutComponent },
  { path:"stubs", component:StubsComponent },
  { path:"usuarios", component:UsuariosComponent },
  { path: "torneos", component: TorneosComponent },
  { path: "crear-usuario/:id", component: CrearUsuarioComponent },
  { path: "crear-torneo/:id", component: CrearTorneoComponent },
  { path: "crear-problema/:id", component: CrearProblemaComponent },
  { path: "torneos/:id", component: TorneoDetalleComponent },
  { path: "**", pathMatch: "full", redirectTo: "/inicio" }
];

export const appRouting = RouterModule.forRoot(routes);
