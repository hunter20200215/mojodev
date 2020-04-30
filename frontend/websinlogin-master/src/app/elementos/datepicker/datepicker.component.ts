import {Component,OnInit, Input} from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import {Moment} from 'moment';
import { MatDatepicker } from '@angular/material';
// tslint:disable-next-line:no-duplicate-imports
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
    providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue:MY_FORMATS },
  ],
})
export class DatepickerComponent implements OnInit {
  @Input() date:string;
  @Input() form:FormGroup; 
  @Input() name:string="fecha";
  _date = new FormControl(moment());
  constructor(private _fb:FormBuilder) { }

  ngOnInit() {
    this.form = this._fb.group({
      fecha:'02/2019'
    })
    this.form.controls[this.name].setValue(moment('02/2019','MM/YYYY'));
  }


  chosenYearHandler(normalizedYear: Moment) {
    
    const ctrlValue = this.form.controls[this.name].value;
    ctrlValue.year(normalizedYear.year());
    this.form.controls[this.name].setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    
    const ctrlValue:Moment = this.form.controls[this.name].value;
    ctrlValue.month(normalizedMonth.month());
    this.form.controls[this.name].setValue(ctrlValue.toJSON());
  }


}
