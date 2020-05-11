import { Torneo } from "./Torneo";
import { Usuario } from "./Usuario";

export interface TorneoUsuario {
  idTorneoUsuario?: number;
  torneo?: Torneo | null;
  usuario?: Usuario | null;
  puntos?: number;
  tiempo?: string;
  token?: string;
}
