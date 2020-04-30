export class EgresosModel {
    id: string;
    afiliados: {
        id: string,
        nombres: string,
        posicion: string,
        afiliado: string,
        telefono: string,
        paisId: string
    };
    descripcion: string;
    monto: string;
    fecha: string;
    nroComprobante: number;
    condicionPago: string;
    tipoEgreso: {
        id: string,
        descripcion: string
    };
}
