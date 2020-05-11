import { Component, Input, ElementRef, OnChanges} from '@angular/core';

@Component({    
    selector: 'read-more',
    template: `
        <div [innerHTML]="currentText">
        </div>
            <a [class.hidden]="hideToggle" style="color:blue;cursor: pointer;" (click)="toggleView()">{{texto()}}</a>
    `
})

export class ReadMoreComponent implements OnChanges {
    @Input() text: string;
    @Input() maxLength: number = 100;
    currentText: string;
    hideToggle: boolean = true;

    public isCollapsed: boolean = true;

    constructor(private elementRef: ElementRef) {

    }
    texto(){
      let respuesta = "Ver";
      if(this.isCollapsed){
        respuesta += " mas" 
      }else if(!this.isCollapsed && this.currentText.length < this.maxLength){
        respuesta = "";
      }else{
        respuesta +=" menos" 
      }
      return respuesta 
    }
    toggleView() {
        this.isCollapsed = !this.isCollapsed;
        this.determineView();
    }
    determineView() {
        if (!this.text || this.text.length <= this.maxLength) {
            this.currentText = this.text;
            this.isCollapsed = false;
            this.hideToggle = true;
            return;
        }
        this.hideToggle = false;
        if (this.isCollapsed == true) {
            this.currentText = this.text.substring(0, this.maxLength) + "...";
        } else if(this.isCollapsed == false)  {
            this.currentText = this.text;
        }

    }
    ngOnChanges() {
        this.determineView();       
    }
}