import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { D3Utils } from '../../d3.utils';
import { Grammatik } from './lab7ShapeTerminal.class';

@Component({
  selector: 'app-lab7',
  templateUrl: './lab7.component.html',
  styleUrls: ['./lab7.component.css']
})
export class Lab7Component implements OnInit, AfterViewInit {
  matrix = [
    [1, 1, 1],
    [1, 0, 1],
    [0, 0, 0]
  ];
  squareLength = 3;
  squareHeight = 3;
  svgWidth = 300;
  svgHeight = 300;
  yScale = d3.scaleLinear().domain([0, 2]).range([0, this.svgHeight]);
  xScale = d3.scaleLinear().domain([0, 2]).range([0, this.svgWidth]);
  result = '';

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    D3Utils.recreateSvg(this.svgWidth * 2, this.svgHeight * 2);
    for (let i = 0; i < this.squareHeight; ++i) {
      for (let j = 0; j < this.squareLength; ++j) {
        this.drawSquare(i, j);
        this.appendStyleForSquare(i, j);
      }
    }
  }

  translate() {
    let grammer = new Grammatik();
    let lines = [];
    for (let i = 0; i < this.squareHeight; ++i) {
      lines.push(Number(this.matrix[i].join('')));
    }
    console.log(lines);
    this.result = grammer.translate(lines);
  }

  private drawSquare(i, j) {
    d3.select('#svg')
      .append('rect')
      .attr('class', `rect${i}${j}`)
      .attr('x', this.xScale(j))
      .attr('y', this.yScale(i))
      .attr('width', this.svgWidth / this.squareLength)
      .attr('height', this.svgHeight / this.squareHeight)
      .on('click', () => {
        this.matrix[i][j] = this.matrix[i][j] === 1 ? 0 : 1;
        this.appendStyleForSquare(i,j);
      });
  }

  private appendStyleForSquare(i, j) {
    if (this.matrix[i][j] === 1) {
      d3.select(`#svg .rect${i}${j}`)
        .style('fill', 'green')
        .style('opacity', 0.5);
    } else {
      d3.select(`#svg .rect${i}${j}`)
        .style('fill', 'red')
        .style('opacity', 1);
    }
  }

}
