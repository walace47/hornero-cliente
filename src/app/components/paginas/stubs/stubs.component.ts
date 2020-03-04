import { Component, OnInit, OnDestroy } from '@angular/core';
import { StubsService } from 'src/app/services/stubs.service';
import { Subscription } from 'rxjs';
import { stub } from 'src/app/model/stub';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-stubs',
  templateUrl: './stubs.component.html',
  providers:[StubsService]
})
export class StubsComponent implements OnInit,OnDestroy {
  private suscripciones:Subscription[] = [];
  public stubs:stub[];
  
  constructor(
    private _stubService:StubsService) { }

  ngOnInit(): void {
    this.suscripciones.push(
      this._stubService.getAll(["idLenguaje"]).subscribe((stubs) => {
        this.stubs = stubs; 
        console.log(this.stubs)
      })
    )
  }

  ngOnDestroy(){
    this.suscripciones.forEach(sub => sub.unsubscribe())
  }

  download(nombreArchivo:string){
    this._stubService.descargar(nombreArchivo).subscribe((archivo)=>{
      let blob:any = new Blob([archivo]);
      fileSaver.saveAs(blob,nombreArchivo)
    })
  }

}
