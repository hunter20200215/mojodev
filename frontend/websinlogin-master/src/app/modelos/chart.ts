export class Chart{
    title:string;
    data:any[];
    columnNames:string[];
    colors:string[];

    constructor(title:string,data:any[],columnNames:string[],colors:string[]){
        this.title = title;
        this.data = data;
        this.columnNames = columnNames;
        this.colors = colors;
    }
}