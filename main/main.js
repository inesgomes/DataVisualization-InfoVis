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
  .domain([0,0.2,0.4, 0.6, 0.8, 1])
  .range(['#feedde','#fdd0a2','#fdae6b','#fd8d3c','#e6550d','#a63603'])
  
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
    console.log("olaola")
    countries.selectAll('.country')
      .data(topojson.feature(data, data.objects.europe).features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
     .attr("fill", function (d) {
        //find country name in map list and color it
        console.log("ta a pintar")
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
    
    //Fazer legenda
    var legend_labels = ["<20%", "+20%", "+40%", "+60%", "+80%", "100%"]
    var legend = svg.selectAll("g.legend")
    .data([0,0.2,0.4, 0.6, 0.8, 1])
    .enter().append("g")
    .attr("class", "legend");
  
    var ls_w = 15, ls_h = 15;

    legend.append("rect")
    .attr("x", 65*viewWidth /100)
    .attr("y", function(d, i){ return (40+viewHeight/2) - (i*ls_h) - 2*ls_h;})
    .attr("width", ls_w)
    .attr("height", ls_h)
    .style("fill", function(d, i) { return color(d); })
    .style("opacity", 0.8);
  
    legend.append("text")
    .attr("x", 20+65*viewWidth / 100)
    .attr("y", function(d, i){ return (40+viewHeight/2) - (i*ls_h) - ls_h - 4;})
    .text(function(d, i){ return legend_labels[i]; });


    return;
  });

  this.svg = svg;
  this.projection = projection;

}

function sliderYears(){
  
 var x = d3.scaleLinear()    //tem de ser discreto
    .domain([2010, 2015])
    .range([0, width/4])
    .clamp(true);
    

//cria 'eixo'
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


//escrever ticks e texto
slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(x.ticks(6))
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) { return d ; }); 
    console.log(x.ticks(6))

//criar bolinha 
var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")  
    .attr("r", 9);

slider.transition() // mudar para ser 'discreto'
    .duration(750)
   /* .tween("hue", function() {
      var i = d3.interpolate(0, 70);
      console.log(i)
      return function(t) { hue(i(t)); };
    });
*/
function hue(h) {
  var ano=Math.round(h);
  handle.attr("cx", x(ano));
  drawMap(assaults, ano)
  console.log(h)
  //svg.style("background-color", d3.hsl(h, 0.8, 0.8));
}

}
var assaults = assault.countries; 
var burglaries = burglary.countries;
var homicides = homicide.countries;
var sexviolences = sexualviolence.countries;

function draw() {
  //get jsons
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