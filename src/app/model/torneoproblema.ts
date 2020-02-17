import { problema } from "./problema";
import { torneo } from "./torneo";

export interface torneoproblema {
  idTorneoProblema?: number;
  idProblema?: problema | null;
  idTorneo?: torneo | null;
  Orden?: number;
}
