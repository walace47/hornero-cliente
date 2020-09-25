import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TorneosComponent } from "./components/lista-torneos/torneos.component";
import { AgregarProblemaComponent} from "./components/agregar-problema/agregar-problema.component";
import { CrearTorneoComponent } from "./components/crear-torneo/crear-torneo.component"
import { TorneoDetalleComponent } from "./components/torneo-detalle/torneo-detalle.component"
import { TorneoRoutingModule } from './torneo-routing.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PrimengModule } from '../primeng/primeng.module';
import { UtilesModule } from '../utiles/utiles.module';
import { HornereandoComponent } from './components/hornereando/hornereando.component';
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [    
    TorneosComponent,
    AgregarProblemaComponent,
    CrearTorneoComponent,
    TorneoDetalleComponent,
    HornereandoComponent,
    ],
  imports: [
    UtilesModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PrimengModule,
    SharedModule,
    TorneoRoutingModule
  ],
  exports:[
    TorneosComponent,
    CrearTorneoComponent,
    TorneoDetalleComponent,
    AgregarProblemaComponent
  ],
  providers:[

  ]
})
export class TorneoModule { }
