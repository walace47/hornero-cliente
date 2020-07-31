import { Usuario } from "./Usuario";

export interface Rol {
  idRol?: ROLES;
  rol?: string ;
  usuarios?: Usuario[];
}


export enum ROLES{
  admin = 1,
  jugador = 2,
  docente = 3
}
