var viewWidth = window.innerWidth;
var viewHeight = window.innerHeight;
d3.select(window).on("resize", resize);

var margin = {top: 20, right: 20, bottom: 30, left: 40};
var width = viewWidth - margin.left - margin.right;
var height = viewHeight - margin.top - margin.bottom;

var svg = d3.select("svg")
    .attr("width", viewWidth)
    .attr("height", viewHeight)
    .append("g")
    .style('background', '#C1E1EC')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function draw() {
  //TODO get json and draw things!
  var countries;
  var center=[4, 68.6];
  /*var svg = d3.select("#map")
    .attr("width", viewWidth)
    .attr("height", viewHeight)
    .style('background', '#C1E1EC');*/
    
  
  var projection = d3.geoMercator()
      .scale(700)
      .translate([viewWidth/2,viewHeight/2])
      .center(center);

  var  path = d3.geoPath()
      .projection(projection);

    countries = svg.append("g");

    d3.json('../data/europe.json', function(data) {
      countries.selectAll('.country')
      .data(topojson.feature(data, data.objects.europe  ).features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path);
      return;
  });

  this.svg = svg;
  this.projection = projection;
  
  console.log("draw")
}

function resize() {
  //This function is called if the window is resized
  //You can update your scatterplot here
  viewWidth = window.innerWidth;
  viewHeight = window.innerHeight;
}


draw();