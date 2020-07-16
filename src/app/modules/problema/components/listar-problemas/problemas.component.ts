import { Component, OnInit } from '@angular/core';
import { Problema } from 'src/app/model/Problema';
import { ProblemaService } from 'src/app/modules/problema/services/problema.service';

@Component({
  selector: 'app-problemas',
  templateUrl: './problemas.component.html',
  styleUrls: ['./problemas.component.css']
})
export class ProblemasComponent implements OnInit {

  public problemas:Problema[] = [];


  constructor(private _problemaService:ProblemaService) {}

  ngOnInit(): void {
    this._problemaService.getAll().toPromise()
      .then((problemas:Problema[]) => this.problemas = problemas)
      .catch(error => console.error(error));
  }
}
