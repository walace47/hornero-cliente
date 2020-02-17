import { stub } from "./stub";
import { usuario } from "./usuario";

export interface lenguaje {
  idLenguaje?: number;
  Lenguaje?: string;
  stubs?: stub[];
  usuarios?: usuario[];
}
