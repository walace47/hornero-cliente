import { TipoTorneo } from "./TipoTorneo";
import { Resolucion } from "./Resolucion";
import { TorneoProblema } from "./TorneoProblema";
import { TorneoUsuario } from "./TorneoUsuario";
import { Usuario } from './Usuario';
import { EstadoTorneo } from './EstadoTorneo';

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
  penalidad?:number;
  creador?:Usuario;
}

export const TIPO_TORNEO = {
  hornerando:4,
  comun:1
}

