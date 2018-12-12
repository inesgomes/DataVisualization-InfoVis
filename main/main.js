var viewWidth = window.innerWidth;
var viewHeight = window.innerHeight;
d3.select(window).on("resize", resize);

var margin = { top: 20, right: 20, bottom: 30, left: 40 };
var width = viewWidth - margin.left - margin.right;
var height = viewHeight - margin.top - margin.bottom;

var assaults = assault.countries;
var burglaries = burglary.countries;
var homicides = homicide.countries;
var sexviolences = sexualviolence.countries;
var robberies = robbery.countries;


var drawCountries = []

var svg = d3.select("svg")
  .attr("width", viewWidth)
  .attr("height", viewHeight)
  .append("g")
  .style('background', '#C1E1EC')
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var color = d3.scaleLinear()
  .clamp(true)
  .domain([0, 0.9, 1, 1.5])
  .range(["red", "#e8eab8", "lightgreen", "#3a6033"])
  .interpolate(d3.interpolateHcl);

var tooltip = d3.select("body") //for hover
  .append("div")
  .attr("class", "tooltip hidden");

function drawMap() {

  var countries;
  var center = [15, 53.3];
  /*var svg = d3.select("#map")
    .attr("width", viewWidth)
    .attr("height", viewHeight)
    .style('background', '#C1E1EC');*/

  var projection = d3.geoMercator()
    .scale(440)
    .translate([viewWidth / 2, viewHeight / 2])
    .center(center);

  var path = d3.geoPath()
    .projection(projection);

  countries = svg.append("g");

  d3.json('../data/europe.json', function (data) {
    var nameTag = svg.append('text')
      .attr('font-family', 'Verdana')
      .attr('font-size', '15px')

    countries.selectAll('.country')
      .data(topojson.feature(data, data.objects.europe).features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr("fill", function (d) {
        /* var country = getiso (d);
       
         var quota =getquota (country);
         var signatures =getsignatures(country);
     
         if(signatures == 0){
           return "#ccc";	
         }
         var diff = signatures/quota;*/
        console.log(d)
        return color(1.5);
      })
      .on("click", function (d) {
        let elem = d3.select(this);
        //TODO retirar clicked do elem
        elem.classed("clicked", true)
          .attr("fill", "blue");
        //add name
        let name = d.properties.NAME
        if (!(drawCountries.includes(name))) {
          drawCountries.push(name)
        }

        drawScatterplot(getArray(defaultX), getArray(defaultY), defaultYear, defaultX, defaultY, drawCountries)
      })

      .on("mousemove", showTooltipPoint) //hover in
      .on("mouseout", hideTooltipPoint) //hover out

    this.svg = svg;
    this.projection = projection;
  })
}

function showTooltipPoint(d) {
  var mouse = d3.mouse(svg.node()).map(function (d) { return parseInt(d); });
  tooltip.classed('hidden', false) //make tooltip visible
    .html(d.properties.NAME) //display the name of point
    .attr('style', //set size of the tooltip
    'left:' + (mouse[0] + 15) + 'px; top:' + (mouse[1] - 35) + 'px')
};

function hideTooltipPoint(d) {
  tooltip.classed('hidden', true); //hide tooltip
}

function draw() {
  //TODO draw things!
  drawMap()
  drawScatterplot(getArray(defaultX), getArray(defaultY), defaultYear, defaultX, defaultY, drawCountries)
  console.log("draw")
}

function resize() {
  //This function is called if the window is resized
  //You can update your scatterplot here
  viewWidth = window.innerWidth;
  viewHeight = window.innerHeight;
}

draw();