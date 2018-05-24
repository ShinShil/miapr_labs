import { Component, OnInit, AfterViewInit } from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-lab2',
  templateUrl: './lab2.component.html',
  styleUrls: ['./lab2.component.css']
})
export class Lab2Component implements OnInit, AfterViewInit {

  svgWidth = 400;
  svgHeight = 170;
  pointRadius = 2;
  pointsAmount = 20000;
  pointsInRaw = this.pointsAmount / this.svgHeight;
  status: string;
  playInterval: any;

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
  }

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
        if (val === 1)++pointsAmount;
        pointsRaw.push(val);
        if (pointMarker === this.pointRadius) {
          pointMarker = 0;
          pointMarkerActivateIndex = this.getRandomNumber(1, this.pointRadius);
        }
      }
      this.dataPoints.push(pointsRaw);
    }
    console.log(this.pointsAmount);
    this.redrawPoints();
  }

  public step() {
    this.centroidsUpdated ? this.updateClusters() : this.updateCentroids();
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

  private recreateSvg() {
    d3.select('#svg-wrapper').html('<svg id="svg"><svg>');
    d3.select("#svg")
      .attr('width', this.svgWidth * this.pointRadius * 2)
      .attr('height', this.svgHeight * this.pointRadius * 2)
  }

  private redrawPoints() {
    this.recreateSvg();
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
    console.log(this.centroids);
    this.redrawCentroids();
  }

  private redrawCentroids() {
    d3.selectAll('#svg .centroid').remove();
    for (let i = 0; i < this.centroids.length; ++i) {
      d3.select('#svg')
        .append('circle')
        .attr('class', () => `centroid centroid${i + 1}`)
        .attr('cx', this.centroids[i].x * 2 * this.pointRadius)
        .attr('cy', this.centroids[i].y * 2 * this.pointRadius)
        .attr('r', this.pointRadius * 20)
        .style('fill', this.getPointColor(i + 1))
        .style('opacity', 0.5);
    }
  }

  private updateClusters() {
    for (let i = 0; i < this.svgHeight; ++i) {
      for (let j = 0; j < this.svgWidth; ++j) {
        let minimum = Number.MAX_VALUE;
        let currCentroid = 0;
        if (this.dataPoints[i][j] !== this.dataVals.EMPTY) {
          for (let k = 0; k < this.centroids.length; ++k) {
            const dist = Math.round(Math.sqrt(Math.pow(this.centroids[k].y - i, 2) + Math.pow(this.centroids[k].x - j, 2)))
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
    this.redrawPoints();
    this.status = 'points has been updated';
  }

  private updateCentroids() {
    console.log('update centroids')
    if (this.centroids.length === 0) {
      (() => {
        for (let i = 0; i < this.svgHeight; ++i) {
          for (let j = 0; j < this.svgWidth; ++j) {
            if (this.dataPoints[i][j] !== this.dataVals.EMPTY) {
              this.centroids.push({ x: j, y: i });
              return;
            }
          }
        }
      })();
      this.status = 'centroids has been updated';
    } else {
      const potentialCentroids: Array<{
        x: number,
        y: number,
        dist: number
      }> = [];
      for (let i = 0; i < this.centroids.length; ++i) {
        potentialCentroids.push({ x: 0, y: 0, dist: 0 });
      }
      for (let i = 0; i < this.svgHeight; ++i) {
        for (let j = 0; j < this.svgWidth; ++j) {
          const currCentroidIndex = this.dataPoints[i][j] - 1;
          if (currCentroidIndex !== this.dataVals.EMPTY - 1) {
            const currCentroid = this.centroids[currCentroidIndex];
            const dist = Math.sqrt(Math.pow(currCentroid.y - i, 2) + Math.pow(currCentroid.x - j, 2));
            if (potentialCentroids[currCentroidIndex].dist < dist) {
              potentialCentroids[currCentroidIndex] = {
                x: j,
                y: i,
                dist
              }
            }
          }
        }
      }

      let bestPotentialCentroid = potentialCentroids[0];
      let allDistances = 0;
      for (let i = 0; i < potentialCentroids.length; ++i) {
        if (bestPotentialCentroid.dist < potentialCentroids[i].dist) {
          bestPotentialCentroid = potentialCentroids[i];
        }

        for (let j = i + 1; j < this.centroids.length; ++j) {
          allDistances += Math.sqrt(Math.pow(this.centroids[i].y - this.centroids[j].y, 2) + Math.pow(this.centroids[i].x - this.centroids[j].x, 2));
        }
      }

      const arithmeticDistance = allDistances / this.centroids.length;

     if (bestPotentialCentroid.dist > arithmeticDistance) {
        this.centroids.push({ x: bestPotentialCentroid.x, y: bestPotentialCentroid.y })
        this.status = 'centroids has been updated';
      } else {
        this.status = 'stop';
      }
    }
    this.redrawCentroids();
    this.centroidsUpdated = true;
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
      'orange',
      'gray',
      'lightblue',
      'maroon'
    ][dataVal]
  }

}
