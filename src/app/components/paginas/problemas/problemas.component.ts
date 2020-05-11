import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { MultiSelect } from 'primeng/multiselect/multiselect';

@Component({
  selector: 'app-problemas',
  templateUrl: './problemas.component.html',
  styleUrls: ['./problemas.component.css']
})
export class ProblemasComponent implements OnInit,AfterViewInit {


  @ViewChild("ms") ms:MultiSelect;

  cars: SelectItem[];

  selectedCars1: string[] = [];

  selectedCars2: string[] = [];

  items: SelectItem[];

  item: string;

  constructor() {
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

  ngAfterViewInit():void{    
  }

  ngOnInit(): void {
  }
  onChangeTest(event1){ 
    let elemento = this.ms.filterInputChild.nativeElement.value 
    if(elemento){

      console.log(this.ms.filterInputChild.nativeElement.value )
      this.cars.push({label:elemento,value:elemento});
      this.selectedCars2.push(elemento);
      
      console.log(event1)
    }
  }
}
