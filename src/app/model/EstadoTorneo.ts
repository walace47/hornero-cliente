import { Torneo } from "./Torneo";

export interface EstadoTorneo {
  idEstado?: number;
  estado?: string;
  torneos?: Torneo[];
}

export enum ESTADO {
  ANTES_DE_COMIENZO = 1,
  EN_PROCESO = 2,
  TERMINADO = 3, 
}