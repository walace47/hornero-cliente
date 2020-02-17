import { tipoproblema } from "./tipoproblema";
import { complejidad } from "./complejidad";
import { resolucion } from "./resolucion";
import { solucion } from "./solucion";
import { torneoproblema } from "./torneoproblema";

export interface problema {
  idProblema?: number;
  idTipo?: tipoproblema | null;
  Nombre?: string;
  Archivo?: string | null;
  Enunciado?: string;
  idComplejidad?: complejidad | null;
  TiempoEjecucionMax?: number;
  resolucions?: resolucion[];
  solucions?: solucion[];
  torneoproblemas?: torneoproblema[];
}
