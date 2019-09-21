import { Component, OnInit } from '@angular/core';
import { Lab8Grammatik } from './lab8Grammatik.class';

@Component({
  selector: 'app-lab8',
  templateUrl: './lab8.component.html',
  styleUrls: ['./lab8.component.css']
})
export class Lab8Component implements OnInit {
  terms: string[] = [
    'caaab',
    'bbaab',
    'caab',
    'bbab',
    'cab',
    'bbb',
    'cb'
  ];
  result = '';
  constructor() { }

  ngOnInit() {
  }

  addTerm(newTerm) {
    this.terms.push(newTerm);
  }

  removeTerm(index: number) {
    this.terms.splice(index, 1);
  }

  generate(amount: number) {
    const grammatic = new Lab8Grammatik();
    this.result = grammatic.generate(amount, this.terms);
  }

  private createGrammatik() {

  }

  private firstStep() {}

}
