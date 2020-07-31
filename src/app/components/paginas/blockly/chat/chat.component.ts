import { Component, OnInit } from '@angular/core';
import { BlocklySocketHandler } from 'src/app/services/blocklySocketHandler.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  chat:Mensaje[];  
  constructor(private _blocklySocket: BlocklySocketHandler) { }

  ngOnInit(): void {
    this._blocklySocket.socket.on("recibirMensaje",(data:chatInterface)=>{
      this.chat.push({
        usaurio:{
          nombreUsuario:data.usuario
        },
        mensaje:data.mensaje.mensaje
      })
    })
  }

}
interface chatInterface{
  mensaje?:Mensaje,
  usuario?:string,
  token?:string,
}

interface Mensaje {
  mensaje:string;
  usaurio:usuarioSala;
}

interface usuarioSala {
  idSocket?: string;
  nombreUsuario?: string;
  color?: string;
  idMarcador?: string;
  bloqueSeleccionado?: string;
}