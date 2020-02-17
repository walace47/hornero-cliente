import { usuario } from "./usuario";

export interface cambioclave {
  idCambio?: number;
  idUsuario?: usuario | null;
  fecha?: Date;
  token?: string;
  estado?: number;
}
