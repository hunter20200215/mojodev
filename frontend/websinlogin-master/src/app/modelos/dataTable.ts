export class DataTable{
        column:any[];
        columnType:any[];
        data:any[];
        buttons:any[];
        filter:boolean;
        add?:{
          title?:string;
          route?:string;
                }

        constructor(column:any[],columnType:any[],data:any[],buttons:any[],filter:boolean,add:any){
                this.column = column;
                this.columnType= columnType;
                this.data = data;
                this.buttons = buttons;
                this.filter = filter;
                this.add = add;
        }
}