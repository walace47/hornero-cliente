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

@Component({
  selector: "app-blockly",
  templateUrl: "./blockly.component.html",
  styleUrls: ["./blockly.component.css"],
  providers: [BlocklySocketHandler],
})
export class BlocklyComponent implements OnInit, AfterContentInit {
  space: Blockly.WorkspaceSvg;
  @Input() token: string;
  blocklyDiv: any;
  toolbox: any;
  private eventChangeHandler: boolean = false;
  recive: boolean = false;
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
    private activeRoute: ActivatedRoute
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
    };

    this._blocklySocket.init();
    this._blocklySocket.socket.emit("conexionBloques", mensaje);
    this._blocklySocket.socket.on("updateXml", (data: blockHandler) => {
      this.recive = true;
      console.log(this.recive);
      let xmlAux = Blockly.Xml.workspaceToDom(this.space);
      let xml_text = Blockly.Xml.domToText(xmlAux);

      if (xml_text !== data.xml) {
        let xml = Blockly.Xml.textToDom(data.xml);
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(xml, this.space);
      }
    });

    this.space = Blockly.inject(this.blocklyDiv, {
      readOnly: false,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true,
      },
      toolbox,
    } as Blockly.BlocklyOptions);
    console.log(this.space);
  }

  ngAfterContentInit() {
    const changeWordkSpaceListener = (event) => {
      console.log(event);

      let js = javascript.workspaceToCode(this.space);
      let xml = Blockly.Xml.workspaceToDom(this.space);
      let xml_text = Blockly.Xml.domToText(xml);
      this.mostrarJavascript.emit({ js, xml: xml_text });
      if (event.element == "dragStop" || event.type === Blockly.Events.DELETE) {
        const mensaje: blockHandler = {
          token: this.token,
          xml: xml_text,
        };
        if (!this.recive) {
          this._blocklySocket.socket.emit("updateXml", mensaje);
        }
      }
      //Este evento se demora un poco la transmision para no saturar los cambios
      if (event.type === Blockly.Events.CHANGE) {
        if (!this.eventChangeHandler) {
          this.eventChangeHandler = true;
          setTimeout(() => {
            const mensaje: blockHandler = {
              token: this.token,
              xml: xml_text,
            };
            this._blocklySocket.socket.emit("updateXml", mensaje);
            this.eventChangeHandler = false;
          }, 500);
        }
      }
      if (this.recive && event.type === Blockly.Events.FINISHED_LOADING) {
        this.recive = false;
      }
    };
    this.space.addChangeListener(changeWordkSpaceListener);
  }

  generateHorneroElements() {
    Blockly.Blocks["respuesta"] = {
      init: function () {
        this.appendValueInput("respuesta")
          .setCheck(null)
          .appendField("respuesta");
        this.setPreviousStatement(true, null);

        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["retorna"] = {
      init: function () {
        this.appendValueInput("respuesta")
          .setCheck(null)
          .appendField("Retorna");
        this.setPreviousStatement(true, null);
        this.setColour(230);
        this.setTooltip("Salida");
        this.setHelpUrl("Salida");
      },
    };

    Blockly.Blocks["entrada"] = {
      init: function () {
        this.appendValueInput("Entrada")
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
    javascript["parametro"] = function (block) {
      var value_parametronumero = javascript.valueToCode(
        block,
        "parametroNumero",
        javascript.ORDER_ATOMIC
      );
      // TODO: Assemble JavaScript into code variable.
      var code = "parseInt(entrada(" + value_parametronumero + "))";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, javascript.ORDER_NONE];
    };

    javascript["respuesta"] = function (block) {
      var value_respuesta = javascript.valueToCode(
        block,
        "respuesta",
        javascript.ORDER_ATOMIC
      );
      // TODO: Assemble JavaScript into code variable.
      var code = "respuesta =" + value_respuesta;
      return code;
    };

    // debería tener dos funcionalidades asignar a respuesta y si no escribe la salida

    javascript["retorna"] = function (block) {
      var value_respuesta = javascript.valueToCode(
        block,
        "respuesta",
        javascript.ORDER_ATOMIC
      );
      // TODO: Assemble JavaScript into code variable.
      var code = "respuesta =" + value_respuesta;
      return code;
    };

    // debería tener dos funcionalidades acceder al valor de parámentro o leer un valor

    javascript["entrada"] = function (block) {
      var value_entrada = javascript.valueToCode(
        block,
        "Entrada",
        javascript.ORDER_ATOMIC
      );
      // TODO: Assemble JavaScript into code variable.
      var code = "entrada(" + value_entrada + ")"; //parseInt(parametros['+value_entrada+'])';
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, javascript.ORDER_NONE];
    };
  }
}

interface blockHandler {
  token: string;
  xml: string;
}
