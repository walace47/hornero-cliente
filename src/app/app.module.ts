import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InicioComponent } from './components/paginas/inicio/inicio.component';
import { AboutComponent } from './components/paginas/about/about.component';
import { appRouting } from './app.routing';
import { TorneosComponent } from './components/paginas/torneos/torneos.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InicioComponent,
    AboutComponent,
    TorneosComponent
  ],
  imports: [
    appRouting,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
