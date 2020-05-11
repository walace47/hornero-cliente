import { Rol } from "./Rol";
import { Lenguaje } from "./Lenguaje";
import { CambioClave } from "./CambioClave";
import { Resolucion } from "./Resolucion";
import { TorneoUsuario } from "./TorneoUsuario";

export interface Usuario {
  idUsuario?: number;
  institucion?: string;
  nombreUsuario?: string;
  descripcion?: string;
  clave?: string;
  rol?: Rol | null;
  email?: string;
  lenguaje?: Lenguaje | null;
  cambioClaves?: CambioClave[];
  resoluciones?: Resolucion[];
  torneosUsuarios?: TorneoUsuario[];
}

export interface UsuarioConectado{
  usuario:Usuario;
  token: string;
  fechaFin:Date;
}
