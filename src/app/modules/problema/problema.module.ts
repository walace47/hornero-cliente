import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProblemaRoutingModule } from './problema-routing.module';
import { ProblemasComponent } from './components/listar-problemas/problemas.component';
import { CrearProblemaComponent } from './components/crear-problema/crear-problema.component';
import { ResolucionesComponent } from './components/resoluciones/resoluciones.component';
import { UtilesModule } from '../utiles/utiles.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../primeng/primeng.module';


@NgModule({
  declarations: [
    ProblemasComponent,
    CrearProblemaComponent,
    ResolucionesComponent
  ],
  imports: [
    UtilesModule,
    FormsModule,
    PrimengModule,
    ReactiveFormsModule,
    CommonModule,
    ProblemaRoutingModule
  ]
})
export class ProblemaModule { }
