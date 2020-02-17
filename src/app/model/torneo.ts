import { estadotorneo } from "./estadotorneo";
import { tipotorneo } from "./tipotorneo";
import { resolucion } from "./resolucion";
import { torneoproblema } from "./torneoproblema";
import { torneousuario } from "./torneousuario";

export interface torneo {
  idTorneo?: number;
  Nombre?: string;
  Descripcion?: string;
  FechaInicio?: Date;
  FechaFin?: Date;
  idEstado?: estadotorneo | null;
  idTipo?: tipotorneo | null;
  resolucions?: resolucion[];
  torneoproblemas?: torneoproblema[];
  torneousuarios?: torneousuario[];
}
