import { Problema } from "./Problema";
import { Torneo } from "./Torneo";

export interface TorneoProblema {
  idTorneoProblema?: number;
  problema?: Problema | null;
  torneo?: Torneo | null;
  orden?: number;
}
