import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-reloj',
	templateUrl: './reloj.component.html',
	styles: [`

			.reloj {
				
				font-size: 7vmin;
		}
		
		`
	]
})
export class RelojComponent implements OnInit {

	@Input() tiempo: number;
	@Output() tiempoCero = new EventEmitter();
	 @Input() public etiqueta: string;
	public days: Number;
	public hours: Number;
	public minutes: Number;
	public seconds: Number;

	constructor() { }

	ngOnInit(): void {
		let x = setInterval(() => {
			// Get today's date and time
			var now = new Date().getTime();

			// Find the distance between now and the count down date
			var distance = this.tiempo;

			// Time calculations for days, hours, minutes and seconds
			this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
			this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			this.seconds = Math.floor((distance % (1000 * 60)) / 1000);

			// Output the result in an element with id="demo"


			// If the count down is over, write some text 
			if (distance < 0) {
				this.days = 0;
				this.hours = 0;
				this.minutes = 0;
				this.seconds = 0;
				this.tiempoCero.emit();
			}
			this.tiempo = this.tiempo - 1000;
		}, 1000);
	}


}
