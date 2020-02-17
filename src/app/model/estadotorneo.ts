import { torneo } from "./torneo";

export interface estadotorneo {
  idEstado?: number;
  Estado?: string;
  torneos?: torneo[];
}
