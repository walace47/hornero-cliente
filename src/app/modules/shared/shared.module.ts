import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { TorneoModule } from '../torneo/torneo.module';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule } from '@angular/forms';
import { RelojComponent } from './components/reloj/reloj.component';

@NgModule({
  declarations: [
    LoginComponent,
    NavbarComponent,
    RelojComponent,
  ],
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    TorneoModule
  ],
  exports:[
    LoginComponent,
    NavbarComponent,
    RelojComponent]
})
export class SharedModule { }
