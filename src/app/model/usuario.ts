import { rol } from "./rol";
import { lenguaje } from "./lenguaje";
import { cambioclave } from "./cambioclave";
import { resolucion } from "./resolucion";
import { torneousuario } from "./torneousuario";

export interface usuario {
  idUsuario?: number;
  Institucion?: string;
  NombreUsuario?: string;
  Descripcion?: string;
  Clave?: string;
  idRol?: rol | null;
  Email?: string;
  idLenguaje?: lenguaje | null;
  cambioclaves?: cambioclave[];
  resolucions?: resolucion[];
  torneousuarios?: torneousuario[];
}

export interface UsuarioConectado{
  usuario:usuario;
  token: string;
  fechaFin:Date;
}
