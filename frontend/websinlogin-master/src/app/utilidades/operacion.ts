import { state } from '@angular/animations';
/*Clase para manejar las Urls de comunicación con los servicios */
export class Operacion {

      public static readonly URLACCOUNTING: string = 'http://localhost:3000/api/accounting/';
            //Comunes
        public static readonly URLPERIODO: string = 'http://localhost:3000/api/accounting/filterFecha';
        // Ingresos
        public static readonly URLCOMBOFILTER: string = 'http://localhost:3000/api/accounting/comboFilter';
        public static readonly URLDETALLECUENTA: string = 'http://localhost:3000/api/accounting/obtenerDetalleCuentaAfiliado?';
        public static readonly URLCOMPARATIVA: string = 'http://localhost:3000/api/accounting/comparativaIngreso?';
        public static readonly URLDETALLE: string = 'http://localhost:3000/api/accounting/obtenerDetalle?';
      
       
      
  
}
