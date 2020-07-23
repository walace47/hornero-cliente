import { Usuario } from "./Usuario";
import { Problema } from "./Problema";
import { Solucion } from "./Solucion";
import { Torneo } from "./Torneo";
import { EstadoResolucion } from "./EstadoResolucion";

export interface Resolucion {
  idResolucion?: number;
  usuario?: Usuario | null;
  problema?: Problema | null;
  solucion?: Solucion | null;
  torneo?: Torneo | null;
  token?: string;
  fechaSolicitud?: string;
  fechaRespuesta?: string | null;
  respuesta?: string | null;
  estado?: EstadoResolucion | null;
}
