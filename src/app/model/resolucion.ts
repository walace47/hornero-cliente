import { usuario } from "./usuario";
import { problema } from "./problema";
import { solucion } from "./solucion";
import { torneo } from "./torneo";
import { estadoresolucion } from "./estadoresolucion";

export interface resolucion {
  idResolucion?: number;
  idUsuario?: usuario | null;
  idProblema?: problema | null;
  idSolucion?: solucion | null;
  idTorneo?: torneo | null;
  Token?: string;
  FechaSolicitud?: string;
  FechaRespuesta?: string | null;
  Respuesta?: string | null;
  idEstado?: estadoresolucion | null;
}
