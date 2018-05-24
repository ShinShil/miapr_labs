import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Elements, INode } from './lab6Elements.class';
import { D3Utils } from '../../d3.utils';
import * as d3 from 'd3';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-lab6',
  templateUrl: './lab6.component.html',
  styleUrls: ['./lab6.component.css']
})
export class Lab6Component implements OnInit, AfterViewInit {
  elements: Elements = new Elements();
  oldAmount: number;
  scaleX: any;
  scaleY: any;
  svgWidth = 500;
  svgHeight = 500;
  fontSize = 16;
  svgMarginBottom = 10;
  constructor() { }

  ngOnInit() {
    this.oldAmount = this.elements.amount;
  }


  ngAfterViewInit() {
    this.redrawTree();
  }

  updateTree() {
    this.elements.updateTree();
    this.redrawTree();
  }

  private redrawTree() {
    this.scaleX = d3.scaleLinear()
      .domain([0, this.elements.amount + 1])
      .range([0, this.svgWidth]);
    this.scaleY = d3.scaleLinear()
      .domain([0, this.elements.treeMaximum.distance])
      .range([this.svgHeight - this.svgMarginBottom - this.fontSize, this.svgMarginBottom + this.fontSize]);
    D3Utils.recreateSvg(this.svgWidth, this.svgHeight + this.fontSize + this.svgMarginBottom);
    d3.select('svg')
      .append('line')
      .attr('x1', this.scaleX(0))
      .attr('y1', 0)
      .attr('x2', this.scaleX(0))
      .attr('y2', this.svgHeight - this.svgMarginBottom - this.fontSize)
      .attr('stroke', 'black')
      .attr('stroke-width', 2);
    this.drawLeaf(this.elements.treeMaximum);
  }

  private drawLeaf(parent: INode, nodeNumber: number = 1) {
    if (parent.children.length > 0) {
      this.appendText(
        0,
        parent.distance,
        parent.distance,
        this.fontSize * 0.2,
        -this.fontSize * 0.2,
        this.getLineColor(nodeNumber),
      );
      this.appendLine(
        0,
        parent.distance,
        parent.posX,
        parent.distance,
        this.getLineColor(nodeNumber),
        1,
        '5, 5'
      )
      this.appendLine(
        parent.children[0].posX,
        parent.distance,
        parent.children[parent.children.length - 1].posX,
        parent.distance,
        this.getLineColor(nodeNumber)
      );
      this.appendLine(
        parent.children[0].posX,
        parent.distance,
        parent.children[0].posX,
        parent.children[0].distance,
        this.getLineColor(nodeNumber)
      );
      this.appendLine(
        parent.children[parent.children.length - 1].posX,
        parent.distance,
        parent.children[parent.children.length - 1].posX,
        parent.children[parent.children.length - 1].distance,
        this.getLineColor(nodeNumber)
      );
      this.appendText(parent.posX, parent.distance, parent.label, 0, this.fontSize, this.getLineColor(nodeNumber))
      for (let i = 0; i < parent.children.length; ++i) {
        this.drawLeaf(parent.children[i], nodeNumber + i + 1);
      }
    } else {
      this.appendText(parent.posX, 0, parent.label, this.fontSize / 2);
    }
  }

  private appendLine(x1, y1, x2, y2, color = 'red', width = 2, strokeDashArray='none') {
    d3.select('svg')
      .append('line')
      .attr('x1', this.scaleX(x1))
      .attr('x2', this.scaleX(x2))
      .attr('y1', this.scaleY(y1))
      .attr('y2', this.scaleY(y2))
      .attr('stroke-dasharray', strokeDashArray)
      .style('stroke', color)
      .style('stroke-width', width);
  }

  private appendText(x, y, text, deltaX = 0, deltaY = 0, color = 'black') {
    d3.select('svg')
      .append('text')
      .attr('x', this.scaleX(x) + deltaX)
      .attr('y', this.scaleY(y) + deltaY)
      .attr('font-size', this.fontSize)
      .attr('fill', color)
      .html(text);
  }

  private getLineColor(index: number) {
    const pallete = D3Utils.getColorPallete();
    return pallete[index % pallete.length];
  }
}
