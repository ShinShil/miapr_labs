import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-lab3',
  templateUrl: './lab3.component.html',
  styleUrls: ['./lab3.component.css']
})
export class Lab3Component implements OnInit, AfterViewInit {
  pointsCount: number = 10000;
  p1 = 0.5;
  p2 = 0.5;
  svgWidth = 500;
  svgHeight = 400;
  status = '';

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.recreateSvg();
  }

  build() {
    this.recreateSvg();
    const points1: number[] = [];
    const points2: number[] = [];
    let m1 = 0;
    let m2 = 0;
    for (let i = 0; i < this.pointsCount; ++i) {
      let nextPoint1 = this.gaussianRandNumber(100, 700);
      let nextPoint2 = this.gaussianRandNumber(-100, 500);
      points1.push(nextPoint1);
      points2.push(nextPoint2);
      m1 += nextPoint1;
      m2 += nextPoint2;
    }

    m1 /= this.pointsCount;
    m2 /= this.pointsCount;

    let sigma1 = 0;
    let sigma2 = 0;
    for (let i = 0; i < this.pointsCount; ++i) {
      sigma1 += Math.pow(points1[i] - m1, 2);
      sigma2 += Math.pow(points2[i] - m2, 2);
    }
    sigma1 = Math.sqrt(sigma1 / this.pointsCount);
    sigma2 = Math.sqrt(sigma2 / this.pointsCount);

    let D = 0;
    const res1: number[] = [this.getPostpriorP(0, this.p1, m1, sigma1)];
    const res2: number[] = [this.getPostpriorP(0, this.p2, m2, sigma2)];
    const scale = 200;

    for (let i = 1; i < this.svgWidth; ++i) {
      const pc1 = this.getPostpriorP(i, this.p1, m1, sigma1);
      const pc2 = this.getPostpriorP(i, this.p2, m2, sigma2);
      res1.push(pc1);
      res2.push(pc2);
      if (Math.abs(pc1 * scale - pc2 * scale) < 0.003) {
        D = i;
      }
      d3.select('#svg')
        .append('line')
        .attr('x1', i - 100 - 1)
        .attr('y1', this.svgHeight - this.svgHeight * scale * res1[i - 1])
        .attr('x2', i - 100)
        .attr('y2', this.svgHeight - this.svgHeight * scale * res1[i])
        .attr('stroke', 'blue');

      d3.select('#svg')
        .append('line')
        .attr('x1', i - 100 - 1)
        .attr('y1', this.svgHeight - this.svgHeight * scale * res2[i - 1])
        .attr('x2', i - 100)
        .attr('y2', this.svgHeight - this.svgHeight * scale * res2[i])
        .attr('stroke', 'lightblue')
    }

    const err1 = res2.slice(0, D).reduce((acc, val) => acc + val);
    let err2 = 0;
    if (this.p1 > this.p2) {
      err2 = res2.slice(D, res2.length).reduce((acc, val) => acc + val);
    } else {
      err2 = res1.slice(D, res2.length).reduce((acc, val) => acc + val);
    }
    this.status = `Ложная тревога: ${err1}; Пропуск обнаружения: ${err2}; Ошибка классификации: ${err1 + err2}`;

    d3.select('#svg')
      .append('line')
      .attr('x1', D - 100)
      .attr('y1', 0)
      .attr('x2', D - 100)
      .attr('y2', this.svgHeight)
      .attr('stroke', 'black')
  }

  private recreateSvg() {
    d3.select('#svg-wrapper').html('<svg id="svg"><svg>');
    d3.select("#svg")
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight);
  }

  private getPostpriorP(x, p, m, sigma) {
    return (Math.exp(-0.5 * Math.pow((x - m) / sigma, 2))
      / (sigma * Math.sqrt(2 * Math.PI)) * p);
  }

  private gaussianRand() {
    let rand = 0;
    for (let i = 0; i < 6; ++i) {
      rand += Math.random();
    }

    return rand / 6;
  }

  private gaussianRandNumber(start, end) {
    return Math.floor(start + this.gaussianRand() * (end - start + 1));
  }

}
