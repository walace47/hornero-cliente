import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginasEstaticasRoutingModule } from './paginas-estaticas-routing.module';
import { AyudaComponent } from './components/ayuda/ayuda.component';


@NgModule({
  declarations: [AyudaComponent],
  imports: [
    CommonModule,
    PaginasEstaticasRoutingModule
  ]
})
export class PaginasEstaticasModule { }
