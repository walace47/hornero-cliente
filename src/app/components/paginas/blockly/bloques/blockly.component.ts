/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Blockly Angular Component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import {
  Component,
  OnInit,
  AfterContentInit,
  EventEmitter,
  Output,
  Input,
} from "@angular/core";
import * as es from "blockly/msg/es";
import * as Blockly from "blockly";
import * as javascript from "blockly/javascript";
import { toolbox } from "../config";
import { BlocklySocketHandler } from "src/app/services/blocklySocketHandler.service";
import { ActivatedRoute } from "@angular/router";
import { UsuarioService } from 'src/app/modules/usuario/services/usuario.service';
import { LoginService } from 'src/app/modules/shared/service/login.service';

@Component({
  selector: "app-blockly",
  templateUrl: "./blockly.component.html",
  styleUrls: ["./blockly.component.css"],
  providers: [
    LoginService],
})
export class BlocklyComponent implements OnInit, AfterContentInit {
  space: Blockly.WorkspaceSvg;
  @Input() token: string;
  blocklyDiv: any;
  toolbox: any;
  private eventChangeHandler: boolean = false;
  recive: boolean = false;
  public color:string;
  @Output() mostrarJavascript = new EventEmitter();

  @Input()
  set cargarXml(value: string) {
    if (value !== "") {
      let xml = Blockly.Xml.textToDom(value);
      Blockly.mainWorkspace.clear();
      Blockly.Xml.domToWorkspace(xml, this.space);
    }
  }

  constructor(
    private _blocklySocket: BlocklySocketHandler,
    private activeRoute: ActivatedRoute,
    private loginService: LoginService
  ) {
    this.toolbox = toolbox;
  }
  
  ngOnInit() {
    this.token = this.activeRoute.snapshot.paramMap.get("idToken");

    this.blocklyDiv = document.getElementById("blocklyDiv");
    this.generateHorneroElements();
    this.configJavascript();
    Blockly.setLocale(es);

    const mensaje: blockHandler = {
      token: this.token,
      xml: "",
      usuario: this.loginService.getUsuario()
    };
    //Se conecta a la sala
    this._blocklySocket.socket.emit("conexionBloques", mensaje);


    //Suscribe al evento actualizar bloque que actualiza los marcadores de los bloques
    this._blocklySocket.socket.on("actualizarBloque",(data:marcaControler) => {
      const block = this.space.getBlockById(data.idBloque);
      const marker = new Blockly.Marker();
      const node = Blockly.ASTNode.createBlockNode(block);
      marker.colour = data.color;
      this.space.getMarkerManager().registerMarker(data.idMarca,marker);
      marker.setCurNode(node);

    })
    
    //suscribe al evento para obtener el color del usuario
    this._blocklySocket.socket.on("getColor",(color:string)=>{
      this.color = color;
    })

    
    //suscribe al evento que Actualiza el xml del espacio de trabajo
    this._blocklySocket.socket.on("updateXml", (data: blockHandler) => {
      //Se desabilitan eventos de los bloques mientras recibe la data
      Blockly.Events.disable();
      //se obtiene los bloques del espacio de trabajo
      let xmlAux = Blockly.Xml.workspaceToDom(this.space);
      //casteo a string
      let xml_text = Blockly.Xml.domToText(xmlAux);
      
      if (xml_text !== data.xml && data.xml != "") {
        let xml = Blockly.Xml.textToDom(data.xml);
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(xml, this.space);
        let xml_text = Blockly.Xml.domToText(xmlAux);

        let js = javascript.workspaceToCode(this.space);
        this.mostrarJavascript.emit({ js, xml: xml_text });
      }
      Blockly.Events.enable();
    
      xml_text = Blockly.Xml.domToText(xmlAux);
      let js = javascript.workspaceToCode(this.space);
      //emite al componente padre el java script y xml nuevo 
      this.mostrarJavascript.emit({ js, xml: xml_text });
      //pide a demanda los marcadores, ya que la actualizacion los borra
      this._blocklySocket.socket.emit("getAllSelects",mensaje);

    });

    this.space = Blockly.inject(this.blocklyDiv, {
      readOnly: false,
      move: {
        media: 'media/',
        scrollbars: true,
        drag: true,
        wheel: true,
      },
      zoom: {controls: true},
      toolbox,
    } as Blockly.BlocklyOptions);
  }

  ngAfterContentInit() {
    //Listener de eventos del estapacio de trabajo
    const changeWordkSpaceListener = (event) => {
      //Si hay un cambio se actualiza al componente padre
      let js = javascript.workspaceToCode(this.space);
      let xml = Blockly.Xml.workspaceToDom(this.space);
      let xml_text = Blockly.Xml.domToText(xml);
      this.mostrarJavascript.emit({ js, xml: xml_text });

      //Si no es del tipo ui y no es create entonces actualiza todos los espacios de trabajo
      if (event.type !== Blockly.Events.UI &&
        event.type !== Blockly.Events.CREATE){
          const mensaje: blockHandler = {
            token: this.token,
            xml: xml_text,
            usuario: this.loginService.getUsuario()
         };
         
         this._blocklySocket.socket.emit("updateXml", mensaje);
    }else{
      //sino si ui y se esta seleccionando un elemento actualizo los marcadores en los espacios de trabajo
      if(event.type == Blockly.Events.UI){
        if (event.element == 'selected') {

            const block = this.space.getBlockById(event.newValue);

            const marker = new Blockly.Marker();
            const node = Blockly.ASTNode.createBlockNode(block);
            marker.colour = this.color;
            this.space.getMarkerManager().registerMarker(this.space.id,marker);
            marker.setCurNode(node);
            let mensaje:blockHandler = {
              bloqueMarca:event.newValue,
              token: this.token,
              usuario: this.loginService.getUsuario(),
              idMarca:this.space.id
            }
            this._blocklySocket.socket.emit("seleccionarBloque",mensaje)
        }
      }
    }
    };
    //Se suscribe la funcion definida anteriormente
    this.space.addChangeListener(changeWordkSpaceListener);
  }


  //Genera la estructura de los bloques personalizados
  generateHorneroElements() {
    Blockly.Blocks["salida"] = {
      init: function () {
        this.appendValueInput("salida")
          .setCheck(null)
          .appendField("Salida");
        this.setPreviousStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["entrada"] = {
      init: function () {
        this.appendValueInput("entrada")
          .setCheck("Number")
          .appendField("Entrada");
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("entrada");
        this.setHelpUrl("entrada");
      },
    };

  }


  // configura la compilacion a ajava script de los bloques personalizados
  configJavascript() {
    
    javascript["salida"] = function (block) {
      var value_respuesta = javascript.valueToCode(
        block,
        "salida",
        javascript.ORDER_ATOMIC
      );
      // TODO: Assemble JavaScript into code variable.
      var code = "salida =" + value_respuesta+"\n";
      return code;
    };

    // debería tener dos funcionalidades asignar a respuesta y si no escribe la salida

    javascript["entrada"] = function (block) {
      var value_entrada = javascript.valueToCode(
        block,
        "entrada",
        javascript.ORDER_ATOMIC
      );
      // TODO: Assemble JavaScript into code variable.
      var code = "entrada(" + value_entrada + ")"+"\n"; //parseInt(parametros['+value_entrada+'])';
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, javascript.ORDER_NONE];
    };
  }
}

interface blockHandler {
  token?:string,
  xml?:string,
  usuario?:string,
  usuariosConectados?: usuarioSala[],
  idMarca?:string,
  bloqueMarca?:string,
}

interface marcaControler {
  idBloque:string,
  idMarca:string,
  color:string
}

interface usuarioSala {
  nombreUsuario?:string,
  color?:string,
  bloqueSeleccionado?:string
}