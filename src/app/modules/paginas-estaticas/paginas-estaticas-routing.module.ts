import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { AboutComponent } from './components/about/about.component';
import { AyudaComponent } from './components/ayuda/ayuda.component';


const routes: Routes = [
  { path: "inicio", component: InicioComponent },
  { path: "ayuda", component: AyudaComponent },
  { path: "about", component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaginasEstaticasRoutingModule { }
