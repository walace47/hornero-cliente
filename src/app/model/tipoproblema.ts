import { Problema } from "./Problema";

export interface TipoProblema {
  idTipo: number;
  tipo: string;
  problemas: Problema[];
}
