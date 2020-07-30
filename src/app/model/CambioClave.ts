import { Usuario } from "./Usuario";

export interface CambioClave {
  idCambio?: number;
  usuario?: Usuario | null;
  fecha?: Date;
  token?: string;
  estado?: number;
}
