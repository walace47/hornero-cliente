import { Injectable } from "@angular/core";
import { connect } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: "root"
  })
  export class BlocklySocketHandler {
    public socket:SocketIOClient.Socket;
    PATH:string = environment.URL_SOCKET;

    constructor(){
      console.log("conexiones")
      this.socket = connect(this.PATH)

    }

    init(){
        console.log(this.PATH)
        //this.socket = connect(this.PATH)
    }
    
  }