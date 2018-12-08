var viewWidth = window.innerWidth;
var viewHeight = window.innerHeight;
d3.select(window).on("resize", resize);

var margin = { top: 20, right: 20, bottom: 30, left: 40 };
var width = viewWidth - margin.left - margin.right;
var height = viewHeight - margin.top - margin.bottom;

var svg = d3.select("#map")
  .attr("width", viewWidth)
  .attr("height", viewHeight)
  .append("g")
  .style('background', '#C1E1EC')
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var color = d3.scaleLinear()
  .clamp(true)
  .domain([0.4, 0.6, 0.8, 1])
  .range(['#fdbe85', '#fd8d3c', '#e6550d', '#a63603'])
  .interpolate(d3.interpolateHcl);

function drawMap(crimes, year) {

  var countries;
  var center = [15, 53.3];
  /*var svg = d3.select("#map")
    .attr("width", viewWidth)
    .attr("height", viewHeight)
    .style('background', '#C1E1EC');*/
  
  //make array with values of crime in one year and finding max for color diff
  let i, maxValues = [];
  for (i = 0; i < crimes.length; i++) {
    maxValues[i] = crimes[i][year]
  }
  var max = d3.max(maxValues);
  console.log(max)

  //begin map
  var projection = d3.geoMercator()
    .scale(300)
    .translate([4*viewWidth / 5, viewHeight / 3])
    .center(center);

  var path = d3.geoPath()
    .projection(projection);

  countries = svg.append("g");
  //load map info 
  d3.json('../data/europe.json', function (data) {
    countries.selectAll('.country')
      .data(topojson.feature(data, data.objects.europe).features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr("fill", function (d) {
        //find country name in map list and color it
        let i;
        for (i = 0; i < crimes.length; i++) {
          if (crimes[i]['country'] == d.properties.NAME) {
            var diff = crimes[i][year] * 1 / max
            return color(diff);
          }
        }
        // TODO d3.scan - tentar substituir for
        //console.log(d3.scan(crimes,(a,b) => a.country == d.properties.NAME))
        return 'aliceblue';
      })
    console.log(data.objects.europe);
    return;
  });

  this.svg = svg;
  this.projection = projection;

}

function sliderYears(){
  var x = d3.scaleLinear()    //tem de ser discreto
    .domain([2010, 2016])
    .range([0, width/3])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + width/4 + "," + margin.top + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { hue(x.invert(d3.event.x)); }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(x.ticks(7))
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) { return d ; });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")  
    .attr("r", 9);

    
slider.transition() // mudar para ser 'discreto'
    .duration(750)
    .tween("hue", function() {
      var i = d3.interpolate(0, 70);
      return function(t) { hue(i(t)); };
    });

function hue(h) {
  handle.attr("cx", x(h));
  svg.style("background-color", d3.hsl(h, 0.8, 0.8));
}


}

function draw() {
  //get jsons
  let assaults = assault.countries;
  let burglaries = burglary.countries;
  let homicides = homicide.countries;
  let sexviolences = sexualviolence.countries;

  console.log(assaults)

  //TODO draw things!
  drawMap(assaults, 2010)
  sliderYears()
  console.log("draw")
}

function resize() {
  //This function is called if the window is resized
  //You can update your scatterplot here
  viewWidth = window.innerWidth;
  viewHeight = window.innerHeight;
}


draw();