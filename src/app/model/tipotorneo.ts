import { torneo } from "./torneo";

export interface tipotorneo {
  idTipo?: number;
  Tipo?: string;
  torneos?: torneo[];
}
