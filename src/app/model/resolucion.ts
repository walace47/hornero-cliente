import { Usuario } from "./Usuario";
import { Problema } from "./Problema";
import { solucion } from "./Solucion";
import { Torneo } from "./Torneo";
import { EstadoResolucion } from "./EstadoResolucion";

export interface Resolucion {
  idResolucion?: number;
  usuario?: Usuario | null;
  problema?: Problema | null;
  solucion?: solucion | null;
  torneo?: Torneo | null;
  token?: string;
  fechaSolicitud?: string;
  fechaRespuesta?: string | null;
  respuesta?: string | null;
  estado?: EstadoResolucion | null;
}
