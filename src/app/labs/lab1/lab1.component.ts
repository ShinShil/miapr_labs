import {Component, OnInit, AfterViewInit} from '@angular/core';

import *  as d3 from 'd3';

@Component({
  selector: 'app-lab1',
  templateUrl: './lab1.component.html',
  styleUrls: ['./lab1.component.css']
})
export class Lab1Component implements OnInit, AfterViewInit {
  svgWidth = 400;
  svgHeight = 170;
  pointRadius = 2;
  pointsAmount = 20000;
  pointsInRaw = this.pointsAmount / this.svgHeight;
  status: string;
  playInterval: any;
  centroidsAmount = 6;

  dataPoints: number[][] = [];
  centroids: Array<{
    x: number,
    y: number
  }> = [];
  dataVals = {
    EMPTY: 0,
    FIRST: 1,
    SECOND: 2,
    THIRD: 3,
    FOURTH: 4,
    FIFTH: 5,
    SIXTH: 6
  };

  private centroidsUpdated = true;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    for (let i = 0; i < this.svgHeight; ++i) {
      const pointsRaw: number[] = [];
      let pointMarkerActivateIndex = this.getRandomNumber(1, this.pointRadius);
      let pointsAmount = 0;
      for (let j = 0, pointMarker = 0; j < this.svgWidth; ++j, ++pointMarker) {
        const val = pointMarker === pointMarkerActivateIndex ? this.dataVals.FIRST : this.dataVals.EMPTY;
        if (val === 1) {
          ++pointsAmount;
        }
        pointsRaw.push(val);
        if (pointMarker === this.pointRadius) {
          pointMarker = 0;
          pointMarkerActivateIndex = this.getRandomNumber(1, this.pointRadius);
        }
      }
      this.dataPoints.push(pointsRaw);
    }
    console.log(this.pointsAmount);
    for (let i = 0, xpos = 30, ypos = 30; i < this.centroidsAmount; ++i, xpos += 30, ypos += 30) {
      if (xpos > this.svgWidth) {
        xpos = 30;
      }
      if (ypos > this.svgHeight) {
        ypos = 30;
      }
      this.centroids.push({x: xpos, y: ypos});
    }
    this.drawPointsAndCentroids();
  }

  public reset() {
    d3.select('#svg-wrapper').html('<svg id="svg"><svg>');
    this.ngAfterViewInit();
  }

  public step() {
    this.centroidsUpdated ? this.updateClusters() : this.updateCentroidsAndStatus();
  }

  public play() {
    this.playInterval = setInterval(() => {
      this.step();
      if (this.status === 'stop') {
        clearInterval(this.playInterval);
      }
    }, 2000);
  }

  public stop() {
    clearInterval(this.playInterval);
  }

  private drawPointsAndCentroids() {
    d3.select('#svg')
      .attr('width', this.svgWidth * this.pointRadius * 2)
      .attr('height', this.svgHeight * this.pointRadius * 2);
    console.log('before draw loop');
    for (let i = 0; i < this.svgHeight; ++i) {
      for (let j = 0; j < this.svgWidth; ++j) {
        if (this.dataPoints[i][j] !== this.dataVals.EMPTY) {
          d3.select('#svg')
            .append('circle')
            .attr('class', () => `point${i}${j}`)
            .attr('r', this.pointRadius)
            .attr('cx', j * this.pointRadius * 2)
            .attr('cy', i * this.pointRadius * 2)
            .style('fill', this.getPointColor(this.dataPoints[i][j]));
        }
      }
    }
    console.log('before centroids loop');
    for (let i = 0; i < this.centroidsAmount; ++i) {
      d3.select('#svg')
        .append('rect')
        .attr('class', () => `centroid${i + 1}`)
        .attr('x', this.centroids[i].x * 2 * this.pointRadius)
        .attr('y', this.centroids[i].y * 2 * this.pointRadius)
        .attr('width', this.pointRadius * 20)
        .attr('height', this.pointRadius * 20)
        .style('fill', this.getPointColor(i + 1))
        .style('opacity', 0.5);
    }
    console.log('after centroids loop');
  }

  private updateClusters() {
    console.log('update clusters');
    d3.select('#svg-wrapper').html('<svg id="svg"><svg>');
    for (let i = 0; i < this.svgHeight; ++i) {
      for (let j = 0; j < this.svgWidth; ++j) {
        let minimum = Number.MAX_VALUE;
        let currCentroid = 0;
        if (this.dataPoints[i][j] !== this.dataVals.EMPTY) {
          for (let k = 0; k < this.centroidsAmount; ++k) {
            const dist = Math.round(Math.sqrt(Math.pow(this.centroids[k].y - i, 2) + Math.pow(this.centroids[k].x - j, 2)));
            if (dist < minimum) {
              minimum = dist;
              currCentroid = k;
            }
          }
          this.dataPoints[i][j] = currCentroid + 1;
        }
      }
    }
    this.centroidsUpdated = false;
    console.log(this.dataPoints);
    this.drawPointsAndCentroids();
    this.status = 'points has been updated';
  }

  private updateCentroidsAndStatus() {
    const centroids: Array<{
      totalPoints: number,
      totalX: number,
      totalY: number
    }> = [];
    for (let i = 0; i < this.centroidsAmount; ++i) {
      centroids.push({totalPoints: 0, totalX: 0, totalY: 0});
    }
    for (let i = 0; i < this.svgHeight; ++i) {
      for (let j = 0; j < this.svgWidth; ++j) {
        if (this.dataPoints[i][j] !== this.dataVals.EMPTY) {
          const centroidsIndex = this.dataPoints[i][j] - 1;
          centroids[centroidsIndex].totalPoints++;
          centroids[centroidsIndex].totalX += j;
          centroids[centroidsIndex].totalY += i;
        }
      }
    }
    let changed = false;
    for (let i = 0; i < this.centroidsAmount; ++i) {
      const newX = centroids[i].totalX / centroids[i].totalPoints;
      const newY = centroids[i].totalY / centroids[i].totalPoints;
      if (this.centroids[i].x !== newX || this.centroids[i].y !== newY) {
        changed = true;
      }
      this.centroids[i].x = newX;
      this.centroids[i].y = newY;
      d3.select(`#svg .centroid${i + 1}`)
        .attr('x', this.centroids[i].x * 2 * this.pointRadius)
        .attr('y', this.centroids[i].y * 2 * this.pointRadius);
    }
    this.centroidsUpdated = true;
    this.status = changed ? 'centroids has been resetted' : 'stop';
  }

  private getRandomNumber(start: number, end: number): number {
    return Math.floor(Math.random() * (end - start + 1) + start);
  }

  private getPointColor(dataVal: number) {
    return [
      'white',
      'red',
      'green',
      'yellow',
      'black',
      'blue',
      'orange'
    ][dataVal];
  }
}
