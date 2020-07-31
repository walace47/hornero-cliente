import { Problema } from "./Problema";

export interface Complejidad {
  idComplejidad?: number;
  complejidad?: string;
  problemas?: Problema[];
}
export enum COMPLEJIDAD{
  baja = 1,
  media = 2,
  alta = 3
}
