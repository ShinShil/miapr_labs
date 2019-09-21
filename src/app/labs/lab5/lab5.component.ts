import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

interface IDefineFunction {
  c: number;
  x1: number;
  x2: number;
  x1x2: number;
}
@Component({
  selector: 'app-lab5',
  templateUrl: './lab5.component.html',
  styleUrls: ['./lab5.component.css']
})
export class Lab5Component implements OnInit {
  defineFunction: IDefineFunction = null;
  svgWidth = 500;
  svgHeight = 500;
  pointRadius = 5;
  newPointX = 0;
  newPointY = 0;
  scaleX = d3.scaleLinear()
    .domain([-5, 5])
    .range([0, this.svgWidth]);
  scaleY = d3.scaleLinear()
    .domain([3, -3])
    .range([0, this.svgHeight]);

  entryPoints: Array<Array<{
    x: number;
    y: number;
  }>> =
    [
      [
        {
          x: -1,
          y: 0
        },
        {
          x: 1,
          y: 1
        }
      ],
      [
        {
          x: 2,
          y: 0
        },
        {
          x: 1,
          y: -2
        }
      ]
    ];

  constructor() { }

  ngOnInit() {
    this.setDefineFunction();
  }

  setDefineFunction() {
    this.defineFunction = {
      x1: 1,
      c: 1,
      x2: 1,
      x1x2: 1
    };

    let currPotentialFunc = this.getPotentialFunction({
      c: 1,
      x1: this.entryPoints[0][0].x,
      x2: this.entryPoints[0][0].y,
      x1x2: this.entryPoints[0][0].y * this.entryPoints[0][0].x,
    });

    for (let i = 0; i < this.entryPoints.length; ++i) {
      for (let j = i === 0 ? 1 : 0; j < this.entryPoints[i].length; ++j) {
        const funcVal = this.countFunction(this.entryPoints[i][j].x, this.entryPoints[i][j].y, currPotentialFunc);
        if (funcVal <= 0 && i === 0) {
          currPotentialFunc = this.summKoeffsPotentialFunction(currPotentialFunc,
            this.getPotentialFunction({
              c: 1,
              x1: this.entryPoints[i][j].x,
              x2: this.entryPoints[i][j].y,
              x1x2: this.entryPoints[i][j].x * this.entryPoints[i][j].y
            })
          );
        } else if (funcVal > 0 && i === 1) {
          currPotentialFunc = this.diffKoeffsPotentialFunction(currPotentialFunc,
            this.getPotentialFunction({
              c: 1,
              x1: this.entryPoints[i][j].x,
              x2: this.entryPoints[i][j].y,
              x1x2: this.entryPoints[i][j].x * this.entryPoints[i][j].y
            })
          );
        }
      }
    }
    this.defineFunction = currPotentialFunc;
    setTimeout(this.drawPotentialFunc.bind(this), 0);
  }

  private recreateSvg() {
    d3.select('#svg-wrapper').html('<svg id="svg"><svg>');
    d3.select('#svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight);
  }

  private drawPotentialFunc() {
    this.recreateSvg();
    const xAxisLength = this.svgWidth;
    const yAxisLength = this.svgHeight;

    const graphicPaths: Array<Array<{ x: number, y: number }>> = [[], []];
    for (let i = -5, j = 0; i < 5; i += 0.1) {
      const y = this.getYFromPotentialFunction(i, this.defineFunction);

      if (y <= 0) {
        j = 1;
      }
      graphicPaths[j].push({
        x: this.scaleX(i),
        y: this.scaleY(y)
      });
    }

    const xAxis = d3.axisBottom(this.scaleX);
    const yAxis = d3.axisRight(this.scaleY);

    const svg = d3.select('#svg');

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(${0}, ${this.svgHeight / 2})`)
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${this.svgWidth / 2}, ${0})`)
      .call(yAxis);

    const line = d3.line<{ x: number, y: number }>()
      .x(d => d.x)
      .y(d => d.y);

    for (let i = 0; i < 2; ++i) {
      svg.append('path')
        .attr('d', line(graphicPaths[i]))
        .style('stroke', 'red')
        .style('stroke-width', 2)
        .style('fill', 'transparent');
    }
    this.entryPoints.forEach((points) => {
      points.forEach(p => this.addPointToGraphic(p.x, p.y))
    });
  }

  private addPointToGraphic(x: number, y: number) {
    const color = this.countFunction(x, y, this.defineFunction) > 0 ? 'blue' : 'lightBlue';
    d3.select('#svg')
      .append('circle')
      .attr('cx', this.scaleX(x))
      .attr('cy', this.scaleY(y))
      .attr('r', this.pointRadius)
      .style('fill', color);
  }

  private getPotentialFunction(func: IDefineFunction) {
    return {
      c: 1 * func.c,
      x1: 4 * func.x1,
      x2: 4 * func.x2,
      x1x2: 16 * func.x1x2
    };
  }

  private summKoeffsPotentialFunction(func1: IDefineFunction, func2: IDefineFunction) {
    return {
      c: func1.c + func2.c,
      x1: func1.x1 + func2.x1,
      x2: func1.x2 + func2.x2,
      x1x2: func1.x1x2 + func2.x1x2
    };
  }

  private diffKoeffsPotentialFunction(func1: IDefineFunction, func2: IDefineFunction) {
    return {
      c: func1.c - func2.c,
      x1: func1.x1 - func2.x1,
      x2: func1.x2 - func2.x2,
      x1x2: func1.x1x2 - func2.x1x2
    };
  }

  private countFunction(x1: number, x2: number, func: IDefineFunction) {
    return func.c + func.x1 * x1 + func.x2 * x2 + func.x1x2 * x1 * x2;
  }

  private getYFromPotentialFunction(x1: number, func: IDefineFunction) {
    return (-func.c - func.x1 * x1) / (func.x2 + func.x1x2 * x1);
  }
}
