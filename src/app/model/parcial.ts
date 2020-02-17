import { cuenta } from "./cuenta";
import { equipo } from "./equipo";

export interface parcial {
  id?: number;
  idCuenta?: cuenta | null;
  idEquipo?: equipo | null;
  Tiempo?: number;
}
