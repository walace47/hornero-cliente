import { parcial } from "./parcial";

export interface cuenta {
  id?: number;
  idTorneo?: number | null;
  Nombre?: string;
  Archivo?: string | null;
  Inicio?: Date | null;
  Fin?: Date | null;
  Tiempo?: number;
  parcials?: parcial[];
}
