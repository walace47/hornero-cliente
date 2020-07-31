import { Torneo } from "./Torneo";

export interface TipoTorneo {
  idTipo?: number;
  tipo?: string;
  torneos?: Torneo[];
}
