import { Lenguaje } from "./Lenguaje";

export interface Stub {
  idStubs?: number;
  lenguaje?: Lenguaje | null;
  descripcion?: string;
  archivo?: string;
}
