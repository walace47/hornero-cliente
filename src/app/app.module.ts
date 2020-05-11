
/* Modulos*/
import { PrimengModule } from './modules/primeng/primeng.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { appRouting } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';



/* servicios */

import {TorneosService} from './services/torneos.service'

/* componentes */

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { InicioComponent } from './components/paginas/inicio/inicio.component';
import { AboutComponent } from './components/paginas/about/about.component';
import { TorneosComponent } from './components/paginas/torneos/torneos.component';
import { TorneoDetalleComponent } from './components/paginas/torneos/torneo-detalle/torneo-detalle.component';
import { LoginComponent } from './components/shared/login/login.component';
import { CrearUsuarioComponent } from './components/paginas/usuarios/crear-usuario/crear-usuario.component';
import { CrearTorneoComponent } from './components/paginas/torneos/crear-torneo/crear-torneo.component';
import { InterceptorTokenService } from './services/interceptor-token.service';
import { ProblemasComponent } from './components/paginas/problemas/problemas.component';
import { CrearProblemaComponent } from './components/paginas/problemas/crear-problema/crear-problema.component';
import { StubsComponent } from './components/paginas/stubs/stubs.component';
import { UsuariosComponent } from './components/paginas/usuarios/usuarios.component';
import { BlocklyComponent } from './components/paginas/blockly/bloques/blockly.component';
import { SwapComponent } from './components/paginas/blockly/swap/swap.component';
import { XmlPipePipe } from './pipes/xml-pipe.pipe';
import { AgregarProblemaComponent } from './components/paginas/torneos/agregar-problema/agregar-problema.component';
import { ReadMoreComponent } from './components/utiles/read-more/read-more.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InicioComponent,
    AboutComponent,
    TorneosComponent,
    TorneoDetalleComponent,
    LoginComponent,
    CrearUsuarioComponent,
    CrearTorneoComponent,
    ProblemasComponent,
    CrearProblemaComponent,
    StubsComponent,
    UsuariosComponent,
    BlocklyComponent,
    SwapComponent,
    XmlPipePipe,
    AgregarProblemaComponent,
    ReadMoreComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    appRouting,
    BrowserModule,
    BrowserAnimationsModule,
    PrimengModule,
    HttpClientModule
  ],
  providers: [
    TorneosService,
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorTokenService, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
