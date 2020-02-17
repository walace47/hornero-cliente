import { RouterModule, Routes } from "@angular/router";
import { InicioComponent } from "./components/paginas/inicio/inicio.component";
import { AboutComponent } from "./components/paginas/about/about.component";
import { TorneosComponent } from './components/paginas/torneos/torneos.component';

const routes: Routes = [
  { path: "inicio", component: InicioComponent },
  { path: "about", component: AboutComponent },
  { path: "torneos", component: TorneosComponent },
  { path: "**", pathMatch: "full", redirectTo: "/inicio" }
];

export const appRouting = RouterModule.forRoot(routes);
