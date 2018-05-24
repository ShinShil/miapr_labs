import * as d3 from 'd3';
export class D3Utils {
    public static recreateSvg(svgWidth: number, svgHeight: number) {
        d3.select('#svg-wrapper').html('<svg id="svg"><svg>');
        d3.select("#svg")
            .attr('width', svgWidth)
            .attr('height', svgHeight);
    }

    public static getColorPallete() {
        return [
            'red',
            'green',
            'yellow',
            'black',
            'blue',
            'orange',
            'gray',
            'lightblue',
            'maroon'
        ];
    }
}