import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleStubComponent } from './components/detalle-stub/detalle-stub.component';
import { StubsComponent } from './components/stubs/stubs.component';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import {TorneoRoutingModule} from "./stub-routing.module"



@NgModule({
  declarations: [DetalleStubComponent, StubsComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule ,
    PrimengModule,
    TorneoRoutingModule
  ],
  exports:[
    DetalleStubComponent,
    StubsComponent]
})
export class StubModule { }
