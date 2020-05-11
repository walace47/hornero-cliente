import { EstadoTorneo } from "./EstadoTorneo";
import { TipoTorneo } from "./TipoTorneo";
import { Resolucion } from "./Resolucion";
import { TorneoProblema } from "./TorneoProblema";
import { TorneoUsuario } from "./TorneoUsuario";
import { Usuario } from './Usuario';

export interface Torneo {
  idTorneo?: number;
  nombre?: string;
  descripcion?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  estado?: EstadoTorneo | null;
  tipo?: TipoTorneo | null;
  resoluciones?: Resolucion[];
  torneosProblemas?: TorneoProblema[];
  torneosUsuarios?: TorneoUsuario[];
  creador?:Usuario;
}
