import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TorneosComponent } from "./components/lista-torneos/torneos.component";
import { AgregarProblemaComponent} from "./components/agregar-problema/agregar-problema.component";
import { CrearTorneoComponent } from "./components/crear-torneo/crear-torneo.component"
import { TorneoDetalleComponent } from "./components/torneo-detalle/torneo-detalle.component"
import { TorneosService } from 'src/app/modules/torneo/services/torneos.service';
import { TorneoRoutingModule } from './torneo-routing.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PrimengModule } from '../primeng/primeng.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorTokenService } from 'src/app/modules/utiles/services/interceptor-token.service';
import { UtilesModule } from '../utiles/utiles.module';
import { HornereandoComponent } from './components/hornereando/hornereando.component';


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
