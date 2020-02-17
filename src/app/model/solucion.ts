import { problema } from "./problema";
import { resolucion } from "./resolucion";

export interface solucion {
  idSolucion?: number;

  idProblema?: problema | null;

  ParametrosEntrada?: string;

  Salida?: string;

  resolucions?: resolucion[];
}
