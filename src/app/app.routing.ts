import { RouterModule, Routes } from "@angular/router";
import { InicioComponent } from "./components/paginas/inicio/inicio.component";
import { AboutComponent } from "./components/paginas/about/about.component";
import { TorneosComponent } from './components/paginas/torneos/torneos.component';
import { TorneoDetalleComponent } from './components/paginas/torneos/torneo-detalle/torneo-detalle.component';
import { CrearUsuarioComponent } from './components/paginas/crear-usuario/crear-usuario.component';

import {CrearTorneoComponent} from './components/paginas/torneos/crear-torneo/crear-torneo.component'

const routes: Routes = [
  { path: "inicio", component: InicioComponent },
  { path: "about", component: AboutComponent },
  { path: "torneos", component: TorneosComponent },
  { path: "crear-usuario", component: CrearUsuarioComponent },
  { path: "crear-torneo/:id", component: CrearTorneoComponent },
  { path: "torneos/:id", component: TorneoDetalleComponent },
  { path: "**", pathMatch: "full", redirectTo: "/inicio" }
];

export const appRouting = RouterModule.forRoot(routes);
