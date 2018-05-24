import { Component, OnInit } from '@angular/core';
import { Elements } from './lab6Elements.class';

@Component({
  selector: 'app-lab6',
  templateUrl: './lab6.component.html',
  styleUrls: ['./lab6.component.css']
})
export class Lab6Component implements OnInit {
  elements: Elements = new Elements();
  constructor() { }

  ngOnInit() {
  }

}
