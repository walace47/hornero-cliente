import { usuario } from "./usuario";

export interface rol {
  idRol?: number;
  Rol?: string;
  usuarios?: usuario[];
}
