import { PipeTransform, Pipe } from '@angular/core';
import { EgresosModel } from '../modelos/egresosModel';

@Pipe({
    name: 'filterEgresos'
})

export class FilterEgresoPipe implements PipeTransform {
    transform(egresos: EgresosModel[], searchTerm: string) {
        if (!egresos || !searchTerm) {
            return egresos;
        }
        return egresos.filter(egreso => egreso.afiliados.nombres.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    }
}
