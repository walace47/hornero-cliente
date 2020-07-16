import { Component, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers:[MessageService]
})
export class AppComponent implements OnDestroy {
  public msgs: Message[] = [];
  private suscription:Subscription[] = [];
  title = 'hornero-cliente';
  
  constructor(
    private messageService: MessageService,
  ){
    this.suscription.push(
      this.messageService.messageObserver.subscribe(
        (mensaje:Message) => this.msgs.push(mensaje),
        (error) => console.log(error))
      )
  }

  ngOnDestroy(){
    this.suscription.forEach(e => e.unsubscribe())
  }
}
