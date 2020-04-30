import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ingreso-detail',
  templateUrl: './ingreso-detail.component.html',
  styleUrls: ['./ingreso-detail.component.css']
})
export class IngresoDetailComponent implements OnInit {

  @Input() ingresoPeriodoData: any;
  titulo: String;
  p: any;

  constructor() { }

  ngOnInit() {
    if (this.ingresoPeriodoData != []) {
      this.titulo = this.ingresoPeriodoData[0].periodo;
    }

  }

}
