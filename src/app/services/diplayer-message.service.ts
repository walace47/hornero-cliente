import { Injectable } from '@angular/core';
import {Message} from "primeng/api"
@Injectable({
  providedIn: 'root'
})
export class DiplayerMessageService {
  public mensajes:Message[] = [];
  constructor() { }
  
}
