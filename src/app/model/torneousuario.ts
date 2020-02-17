import { torneo } from "./torneo";
import { usuario } from "./usuario";

export interface torneousuario {
  idTorneoUsuario?: number;
  idTorneo?: torneo | null;
  idUsuario?: usuario | null;
  Puntos?: number;
  Tiempo?: string;
  Token?: string;
}
