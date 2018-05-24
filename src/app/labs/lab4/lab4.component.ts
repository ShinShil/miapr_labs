import { Component, OnInit } from '@angular/core';
import { createRendererV1 } from '@angular/core/src/view/refs';

@Component({
  selector: 'app-lab4',
  templateUrl: './lab4.component.html',
  styleUrls: ['./lab4.component.css']
})
export class Lab4Component implements OnInit {
  defineFunctions: number[][] = [];
  classAmount = 3;
  classSize = 3;
  representations = [
    [
      [0, 0, 1]
    ],
    [
      [1, 1, 1]
    ],
    [
      [-1, 1, 1]
    ]
  ]
  definitionRepresentation = [0, 0, 0];
  representationIndex: number = null;

  constructor() { }

  ngOnInit() {

  }

  onClassAmountChange() {
    const isBalance = () => this.classAmount == this.representations.length;
    const operation = () => this.representations.length > this.classAmount
      ? this.representations.pop()
      : this.representations.push([]);
    while (!isBalance()) {
      operation();
    }
  }

  onClassSizeChange() {
    for (let i = 0; i < this.representations.length; ++i) {
      for (let j = 0; j < this.representations[i].length; ++j) {
        const isBalance = () => this.representations[i][j].length == this.classSize;
        const operation = () => {
          if (this.representations[i][j].length > this.classSize) {
            this.representations[i][j].pop();
            this.definitionRepresentation.pop();
          } else {
            this.representations[i][j].push(0);
            this.definitionRepresentation.push(0);
          }
        }
        while (!isBalance()) {
          operation();
        }
      }
    }
  }

  learn() {
    const weights = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
    // one representation - one class
    const representations = [
      [0, 0, 1],
      [1, 1, 1],
      [-1, 1, 1]
    ]
    const d = [0, 0, 0];
    const c = 1;
    let weightsHasBeenChanged = true;
    while (weightsHasBeenChanged) {
      for (let representationIndex = 0; representationIndex < representations.length; ++representationIndex) {
        weightsHasBeenChanged = false;
        for (let weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
          d[weightIndex] = this.multiplyVectors(weights[weightIndex], representations[representationIndex]);
        }
        for (let weightIndex = 0; weightIndex < d.length; ++weightIndex) {
          if (weightIndex === representationIndex) {
            continue;
          }
          if (d[weightIndex] >= d[representationIndex]) {
            weightsHasBeenChanged = true;
            weights[weightIndex] = this.diffVectors(weights[weightIndex], representations[representationIndex])
          }
        }
        if (weightsHasBeenChanged) {
          weights[representationIndex] = this.summVectors(weights[representationIndex], representations[representationIndex]);
        }
      }
    }
    this.defineFunctions = weights;
  }

  define() {
    let maxChance = this.multiplyVectors(this.definitionRepresentation, this.defineFunctions[0]);
    let representationIndex = 0
    for (let i = 1; i < this.definitionRepresentation.length; ++i) {
      let chances = this.multiplyVectors(this.definitionRepresentation, this.defineFunctions[i]);
      if (chances > maxChance) {
        maxChance = chances;
        representationIndex = i;
      }
    }
    this.representationIndex = representationIndex;
  }

  addRepresentation(classIndex: number) {
    const newRepresentation = [];
    for (let i = 0; i < this.classSize; ++i) {
      newRepresentation.push(0);
    }
    this.representations[classIndex].push(newRepresentation);
  }

  private multiplyVectors(v1: number[], v2: number[]) {
    return v1.map((val, i) => v1[i] * v2[i]).reduce((acc, val) => acc + val);
  }

  private multiplyVector(v1: number[], multiplier: number) {
    return v1.map(val => val * multiplier).reduce((acc, val) => acc + val);
  }

  private summVectors(v1: number[], v2: number[]) {
    return v1.map((val, i) => v1[i] + v2[i]);
  }

  private diffVectors(v1: number[], v2: number[]) {
    return v1.map((val, i) => v1[i] - v2[i]);
  }
}
