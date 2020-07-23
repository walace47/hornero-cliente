import { Stub } from "./Stub";
import { Usuario } from "./Usuario";

export interface Lenguaje {
  idLenguaje?: number;
  lenguaje?: string;
  stubs?: Stub[];
  usuarios?: Usuario[];
}
