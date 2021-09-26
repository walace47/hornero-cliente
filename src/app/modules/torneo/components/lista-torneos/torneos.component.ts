import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { SelectItem, MenuItem } from "primeng/api";
import { Torneo } from "src/app/model/Torneo";
import { ESTADO } from "src/app/model/EstadoTorneo";
import { TorneosService } from "../../services/torneos.service";
import { LoginService } from "src/app/modules/shared/service/login.service";
import { UsuarioService } from "src/app/modules/usuario/services/usuario.service";
import { TorneoUsuario } from "src/app/model/TorneoUsuario";
import { DataView } from "primeng/dataview/dataview";

@Component({
  selector: "app-torneos",
  templateUrl: "./torneos.component.html",
  providers: [],
})
export class TorneosComponent implements OnInit {
  public mensaje: any;
  public displayMensaje: boolean = false;
  torneos: Torneo[];
  torneosUsuario: TorneoUsuario[];
  selectTorneo: Torneo;
  sortOptions: SelectItem[];
  sortKey: string;
  sortKeyEstado: string;
  sortField: string;
  sortOrder: number;
  public filtroNombre: string;
  @ViewChild("dv") dv: DataView;
  public opcionesActivo: SelectItem[];
  items: MenuItem[];
  public torneoMapItems: object = [];
  @Input() cantRows: number = 10;
  @Input() userTorneo: boolean = false;

  constructor(
    private _torneos: TorneosService,
    private _loginService: LoginService,
    private _usuarioService: UsuarioService,
    private router: Router
  ) {
    this.opcionesActivo = [
      {
        label: "Todos",
        value: "Todos",
      },
      {
        label: "Activos",
        value: "Activos",
      },
      {
        label: "Antes de comienzo",
        value: "Antes_De_Comienzo",
      },
      {
        label: "Finalizados",
        value: "Finalizados",
      },
    ];
    this.mensaje = {
      datos: "",
      header: "",
    };
  }

  ngOnInit() {
    this.menuItem();
    if (!this.userTorneo) {
      this._torneos
        .getAll(["creador", "estado"])
        .subscribe((torneos: Torneo[]) => {
          this._usuarioService.getTorneos().then((torneoDelUsuario) => {
            torneos.forEach((torneo) => {
              let item = [];
              item.push({
                label:"Detalle",
                icon: "pi pi-eye",
                command:(torneo) => {
                  this.router.navigate([
                    "/torneos",
                    torneo.idTorneo,
                  ]);
                }
              })
              //Si esta incripto en el torneo
              if (torneo.estado.idEstado === ESTADO.EN_PROCESO) {
                if (
                  !torneoDelUsuario.find(
                    (el) => el.torneo.idTorneo === torneo.idTorneo
                  )
                ) {
                  item.push({
                    label: "Incribirse",
                    icon: "pi pi-pencil",
                    command: (torneo) => {
                      this.inscribirse(torneo);
                    },
                  });
                  //sino esta inscripto
                } else {
                  item.push({
                    label: "Desinscribirse",
                    icon: "pi pi-pencil",
                    command: (torneo) => {
                      console.log(torneo);
                    },
                  });
                }
              }
              if (
                (this._loginService.isDocente() &&
                  this._loginService.esDuenio(torneo)) ||
                this._loginService.isAdmin()
              ) {
                item.push({
                  label: "Editar",
                  icon: "pi pi-user-edit",
                  command: (torneo) => {
                    this.router.navigate([
                      "/crear-torneo",
                      torneo.idTorneo,
                    ]);
                  },
                });
              }
              this.torneoMapItems[torneo.idTorneo] = item;
            });
          });
          this.torneos = torneos;
        });
    } else {
      this._usuarioService.getTorneos().then((torneosUsuarios) => {
        this.torneosUsuario = torneosUsuarios;
        this.torneos = this.torneosUsuario.map(
          (userTorneo) => userTorneo.torneo
        );
      });
    }
    this.sortOptions = [
      { label: "Oldest First", value: "fechaFin" },
      { label: "Newest First", value: "!fechaFin" },
    ];
  }

  selectTorneoFunc(torneo: Torneo) {
    this.selectTorneo = torneo;
    console.log(this.selectTorneo);
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf("!") === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  handlerInput(value:string) {
    
  }

  nombreFilter(value: string) {
    this.dv.filter(value);
    console.log(this.sortKeyEstado)
    console.log(this.dv.filteredValue)
    this.estadoFilter(this.sortKeyEstado, this.dv.filteredValue)
  }
  navegarTorneoDetalle(idTorneo:number){
    this.router.navigate(['/torneos',idTorneo]);
  }
  
  estadoFilter(value: string, listaAFiltrar:any[] = this.dv.value ) {
    //El dataview tiene informacion
    if (this.dv.value && this.dv.value.length) {
      const valorAFitrar = listaAFiltrar //this.dv.filteredValue || this.dv.value;
      switch (value) {
        case "Activos": {
          this.dv.filteredValue = valorAFitrar.filter(
            (e) => e.estado.idEstado === ESTADO.EN_PROCESO
          );
          break;
        }
        case "Antes_De_Comienzo": {
          this.dv.filteredValue = valorAFitrar.filter(
            (e) => e.estado.idEstado === ESTADO.ANTES_DE_COMIENZO
          );
          break;
        }
        case "Finalizados": {
          this.dv.filteredValue = valorAFitrar.filter(
            (e) => e.estado.idEstado === ESTADO.TERMINADO
          );
          break;
        }
        case "Todos": {
          this.dv.filteredValue = this.dv.value;
        }
      }

      if (this.dv.filteredValue.length === this.dv.value.length) {
        this.dv.filteredValue = null;
      }
      if (this.dv.paginator) {
        this.dv.first = 0;
        this.dv.totalRecords = this.dv.filteredValue
          ? this.dv.filteredValue.length
          : this.dv.value
          ? this.dv.value.length
          : 0;
      }
    }
  }

  onFilterActivosChange(event) {
    let listaAFiltrar;
    if(this.filtroNombre !== "") {
      listaAFiltrar = this.dv.filteredValue || this.dv.value
      this.estadoFilter(event.value,this.dv.filteredValue)
    } else this.estadoFilter(event.value)
  }

  onDialogHide() {
    this.selectTorneo = null;
  }

  inscribirse(torneo: Torneo) {
    if (!this._loginService.isLogin()) {
      this._loginService.setDisplay(true);
    } else {
      this._torneos
        .inscribirse(torneo.idTorneo)
        .then(() => {
          this.router.navigate(["/torneos", torneo.idTorneo]);
        })
        .catch((error) => {
          switch (error.status) {
            case 400: {
              this.mensaje.header = "Ya estas inscripto";
              this.mensaje.datos = `Ya estas registrado en este torneo ${torneo.nombre} `;
              this.displayMensaje = true;
            }
          }
        });
    }
  }

  esDocente() {
    return this._loginService.isDocente();
  }

  incripcionHabilitada(torneo: Torneo) {
    const fechaTorneo = new Date(torneo.fechaFin);
    return fechaTorneo > new Date() && !this.torneosUsuario;
  }

  menuItem() {
    this.items = [
      {
        label: "Incribirse",
        icon: "pi pi-pencil",
        command: (torneo) => {
          this.inscribirse(torneo);
        },
        visible: true,
      },
      {
        label: "Editar",
        icon: "pi pi-user-edit",
        command: (torneo) => {
          this.router.navigate(["/crear-torneo", torneo.idTorneo]);
        },
      },
    ];
  }
}
