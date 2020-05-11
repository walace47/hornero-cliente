import { Component, OnDestroy } from '@angular/core';
import {MessageService} from 'primeng/api';
import { Subscription } from 'rxjs';
import {Message} from 'primeng/api';
import { DiplayerMessageService } from './services/diplayer-message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers:[MessageService]
})
export class AppComponent implements OnDestroy {
  public msgs: Message[] = [];
  private suscription:Subscription[] = [];
  title = 'hornero-cliente';
  constructor(private messageService: MessageService,public mensaje:DiplayerMessageService){
    this.suscription.push(
      this.messageService.messageObserver.subscribe(
        (mensaje:Message) => {console.log("mensaje23123");this.msgs.push(mensaje)},
        (error) => console.log(error))
      )
  }

  ngOnDestroy(){
    this.suscription.forEach(e => e.unsubscribe())
  }
}
