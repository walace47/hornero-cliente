import { Problema } from "./Problema";
import { Resolucion } from "./Resolucion";

export interface solucion {
  idSolucion?: number;
  problema?: Problema | null;
  parametrosEntrada?: string;
  salida?: string;
  resoluciones?: Resolucion[];
}
