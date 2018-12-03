// data that you want to plot, I've used separate arrays for x and y values
let assalto = assault.countries;
let roubos = robbery.countries;

// size and margins for the chart
var margin = {top: 20, right: 15, bottom: 60, left: 60}
  , width = 960 - margin.left - margin.right
  , height = 960 - margin.top - margin.bottom;

// x and y scales, I've used linear here but there are other options
// the scales translate data values to pixel values for you
console.log(assalto[2010])

let index = 0; 
let xValues = [];
let yValues = [];

for(index=0; index < assalto.length; index++){
  xValues[index] = assalto[index][2010];
  yValues[index] = assalto[index][2010];
}

console.log(xValues);

var x = d3.scaleLinear()
          .domain([0, d3.max(xValues)])  // the range of the values to plot
          .range([0, width]);        // the pixel range of the x-axis

var y = d3.scaleLinear()
          .domain([0, d3.max(yValues)])
          .range([height, 0]);

// the chart object, includes all margins
var chart = d3.select('body')
.append('svg:svg')
.attr('width', width + margin.right + margin.left)
.attr('height', height + margin.top + margin.bottom)
.attr('class', 'chart')

// the main object where the chart and axis will be drawn
var main = chart.append('g')
.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
.attr('width', width)
.attr('height', height)
.attr('class', 'main')

// draw the x axis
var xAxis = d3.axisBottom()
    .scale(x);


main.append('g')
.attr('transform', 'translate(0,' + height + ')')
.attr('class', 'main axis date')
.call(xAxis);

// draw the y axis
var yAxis = d3.axisLeft()
    .scale(y);

main.append('g')
.attr('transform', 'translate(0,0)')
.attr('class', 'main axis date')
.call(yAxis);

// draw the graph object
var g = main.append("svg:g"); 
//console.log(assalto); 
g.selectAll("scatter-dots")
.data(assalto)
  .enter().append("svg:circle")  // create a new circle for each value
      .attr("cx", function (d, i) { return x(xValues[i]); } ) // translate y value to a pixel
      .attr("cy", function (d, i) { return y(yValues[i]); } ) // translate x value
      .attr("r", 5) // radius of circle
      .style("opacity", 0.6); // opacity of circle