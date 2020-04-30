import { Component, OnInit, Input } from '@angular/core';
import {  FormGroup } from '@angular/forms';

@Component({
  selector: 'app-datepicker-long',
  templateUrl: './datepicker-long.component.html',
  styleUrls: ['./datepicker-long.component.css']
})
export class DatepickerLongComponent implements OnInit {

  
  @Input() form:FormGroup;
  @Input() name:string;
  
  constructor( ) { }
  
  ngOnInit() {
  }

}
