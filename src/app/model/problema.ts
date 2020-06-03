import { TipoProblema } from "./TipoProblema";
import { Complejidad } from "./Complejidad";
import { Resolucion } from "./Resolucion";
import { Solucion } from "./Solucion";
import { TorneoProblema } from "./TorneoProblema";
import {Etiqueta} from './Etiqueta';

export interface Problema {
  idProblema?: number;
  tipo?: TipoProblema | null;
  nombre?: string;
  archivo?: string | null;
  enunciado?: string;
  complejidad?: Complejidad | null;
  tiempoEjecucionMax?: number;
  resoluciones?: Resolucion[];
  soluciones?: Solucion[];
  torneoproblemas?: TorneoProblema[];
  etiquetas?:Etiqueta[];
}
