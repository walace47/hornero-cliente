import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { MultiSelect } from 'primeng/multiselect/multiselect';
import { Problema } from 'src/app/model/Problema';
import { ProblemaService } from 'src/app/services/problema.service';

@Component({
  selector: 'app-problemas',
  templateUrl: './problemas.component.html',
  styleUrls: ['./problemas.component.css']
})
export class ProblemasComponent implements OnInit {

  public problemas:Problema[] = [];



  //componentes a borrar//////////////////
  @ViewChild("ms") ms:MultiSelect;
  cars: SelectItem[];
  selectedCars1: string[] = [];
  items: SelectItem[];
  item: string;
/////////////////////////////////////
  constructor(private _problemaService:ProblemaService) {
      this.cars = [
          {label: 'Audi', value: 'Audi'},
          {label: 'BMW', value: 'BMW'},
          {label: 'Fiat', value: 'Fiat'},
          {label: 'Ford', value: 'Ford'},
          {label: 'Honda', value: 'Honda'},
          {label: 'Jaguar', value: 'Jaguar'},
          {label: 'Mercedes', value: 'Mercedes'},
          {label: 'Renault', value: 'Renault'},
          {label: 'VW', value: 'VW'},
          {label: 'Volvo', value: 'Volvo'},
      ];

      this.items = [];
      for (let i = 0; i < 10000; i++) {
          this.items.push({label: 'Item ' + i, value: 'Item ' + i});
      }
  }

 


  ngOnInit(): void {
    this._problemaService.getAll().toPromise()
      .then((problemas:Problema[]) => this.problemas = problemas)
      .catch(error => console.error(error));
      
  }
  onChangeTest(event1){ 
    let elemento = this.ms.filterInputChild.nativeElement.value 
    //Controlar que la etiqueta  
    if(elemento){

      console.log(this.ms.filterInputChild.nativeElement.value )
      this.cars.push({label:elemento,value:elemento});
      
      //this.selectedCars2.push(elemento);
      
      console.log(event1)
    }
  }
}
