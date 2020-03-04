import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crear-problema',
  templateUrl: './crear-problema.component.html'
})
export class CrearProblemaComponent implements OnInit {
  private suscripciones:Subscription[] = [];
  public problemaForm: FormGroup;
  public submitted: boolean;
  public loading:boolean;
  public id:string;
  private esEdicion = false;
  public archivo:File
  constructor(
    private fb: FormBuilder, 
    private activeRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.paramMap.get('id');

    this.problemaForm = this.fb.group({
      'nombre': new FormControl('', Validators.required),
      'archivo': new FormControl(''),
      'enunciado':new FormControl('',Validators.required),
      'tipo':new FormControl('',Validators.required),
      'complejidad':new FormControl('',Validators.required),
      'tiempoEjecucion':new FormControl('',Validators.required)
    }) 

  }

  onSubmit(problema:object){

  }

  myUploader(event) {
    //event.files == files to upload
    console.log(event)
  }

  verDatos(){
    console.log(this.problemaForm.value)
    console.log(this.archivo)
  }

}
