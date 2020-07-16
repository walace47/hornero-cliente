
/* Modulos*/
import { PrimengModule } from './modules/primeng/primeng.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { appRouting } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/* componentes */

import { AppComponent } from './app.component';

import { AboutComponent } from './modules/paginas-estaticas/components/about/about.component';
import { StubsComponent } from './components/paginas/stubs/stubs.component';
import { BlocklyComponent } from './components/paginas/blockly/bloques/blockly.component';
import { SwapComponent } from './components/paginas/blockly/swap/swap.component';
import { XmlPipePipe } from './pipes/xml-pipe.pipe';
import { BlocklySocketHandler } from './services/blocklySocketHandler.service';
import { CodigoUsuarioComponent } from './components/paginas/blockly/codigo-usuario/codigo-usuario.component';
import { ChatComponent } from './components/paginas/blockly/chat/chat.component';


import { UsuarioModule } from './modules/usuario/usuario.module';
import { TorneoModule } from './modules/torneo/torneo.module';
import { UtilesModule } from './modules/utiles/utiles.module';
import { ProblemaModule } from './modules/problema/problema.module';
import { SharedModule } from './modules/shared/shared.module';
import { InicioComponent } from './modules/paginas-estaticas/components/inicio/inicio.component';
import { PaginasEstaticasModule } from './modules/paginas-estaticas/paginas-estaticas.module';


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    AboutComponent,
    StubsComponent,
    BlocklyComponent,
    SwapComponent,
    XmlPipePipe,
    CodigoUsuarioComponent,
    ChatComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    PaginasEstaticasModule,
    TorneoModule,
    UsuarioModule,
    ProblemaModule,
    BrowserModule,
    BrowserAnimationsModule,
    PrimengModule,
    HttpClientModule,
    UtilesModule,
    appRouting,
    SharedModule,
   
  ],
  providers: [
    BlocklySocketHandler,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
