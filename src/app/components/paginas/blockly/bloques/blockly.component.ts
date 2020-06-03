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
import { UsuarioService } from 'src/app/services/usuario.service';
import { LoginService } from 'src/app/services/login.service';

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
    console.log(this.blocklyDiv);
    this.generateHorneroElements();
    this.configJavascript();
    Blockly.setLocale(es);

    /* Inicializacion  socket*/
    const mensaje: blockHandler = {
      token: this.token,
      xml: "",
      usuario: this.loginService.getUsuario()
    };

    //this._blocklySocket.init();
    this._blocklySocket.socket.on("actualizarBloque",(data:marcaControler) => {
      const block = this.space.getBlockById(data.idBloque);
      const marker = new Blockly.Marker();
      const node = Blockly.ASTNode.createBlockNode(block);
      marker.colour = data.color;
      this.space.getMarkerManager().registerMarker(data.idMarca,marker);
      marker.setCurNode(node);

    })
    
    this._blocklySocket.socket.on("getColor",(color:string)=>{
      this.color = color;
    })
    
    this._blocklySocket.socket.emit("conexionBloques", mensaje);
    
    this._blocklySocket.socket.on("updateXml", (data: blockHandler) => {
      //this.recive = true;
      Blockly.Events.disable();
      //console.log(this.recive);
      let xmlAux = Blockly.Xml.workspaceToDom(this.space);
      let xml_text = Blockly.Xml.domToText(xmlAux);

      let js = javascript.workspaceToCode(this.space);
      this.mostrarJavascript.emit({ js, xml: xml_text });
      if (xml_text !== data.xml && data.xml != "") {
        let xml = Blockly.Xml.textToDom(data.xml);
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(xml, this.space);
        let xml_text = Blockly.Xml.domToText(xmlAux);

        let js = javascript.workspaceToCode(this.space);
        this.mostrarJavascript.emit({ js, xml: xml_text });
      }
      Blockly.Events.enable();
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
    const changeWordkSpaceListener = (event) => {
      let js = javascript.workspaceToCode(this.space);
      let xml = Blockly.Xml.workspaceToDom(this.space);
      let xml_text = Blockly.Xml.domToText(xml);
      this.mostrarJavascript.emit({ js, xml: xml_text });


      if (event.type !== Blockly.Events.UI &&
        event.type !== Blockly.Events.CREATE){
          const mensaje: blockHandler = {
            token: this.token,
            xml: xml_text,
            usuario: this.loginService.getUsuario()
         };
         
         this._blocklySocket.socket.emit("updateXml", mensaje);
    }else{
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
  this.space.addChangeListener(changeWordkSpaceListener);
  }

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

    Blockly.Blocks["parametro"] = {
      init: function () {
        this.appendValueInput("parametroNumero")
          .setCheck("Number")
          .appendField("Parámetro Número");
        this.setOutput(true, null);

        this.setColour(230);
        this.setTooltip("Parámetro de hornero");
        this.setHelpUrl("");
      },
    };
  }

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