export interface EntradaJuego {
    parametrosEntrada?:string;
    token?:string;
    status:number;
    penalidad?:number;
    parametrosHornereando?:any;
}

export interface RespuestaJuego {
    respuesta:string;
    token:string;
}