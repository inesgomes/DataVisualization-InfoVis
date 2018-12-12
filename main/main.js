var viewWidth = window.innerWidth;
var viewHeight = window.innerHeight;
d3.select(window).on("resize", resize);

var margin = { top: 20, right: 20, bottom: 30, left: 40 };
var width = viewWidth - margin.left - margin.right;
var height = viewHeight - margin.top - margin.bottom;

var svg = d3.select("#slider")
  .attr("width", viewWidth/2)
  .attr("height", height/5)
  .style('background', '#C1E1EC') 
  //.attr("transform", "translate(0," + margin.top  + ")")
  .append("g");

function sliderYears() {

  var x = d3.scaleLinear()
    .domain([2010, 2015])
    .range([0, width / 4])
    .clamp(true);

  //cria 'eixo'
  var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + width / 8 + "," + margin.top + ")");

  slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")   
    .call(d3.drag()
      .on("start.interrupt", function () { slider.interrupt(); })
      .on("start drag", function () { f(x.invert(d3.event.x)); }));


  //escrever ticks e texto
  slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(x.ticks(6))
    .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function (d) { return d; });
  //console.log(x.ticks(6))

  //criar bolinha 
  var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

    slider.transition()
    .duration(750)

  function f(h) {
    var ano = Math.round(h);
    handle.attr("cx", x(ano));
    drawMap(sexviolences, ano)
    //console.log(h)
    updatePCP(drawCountries,ano)
  }    
}

var assaults = assault.countries;
var burglaries = burglary.countries;
var homicides = homicide.countries;
var robberies = robbery.countries;
var sexviolences = sexualviolence.countries;
var drawCountries=[];

function draw() {
  sliderYears()

  drawMap(assaults, 2010)
  
  drawScatterplot(getArray(defaultX), getArray(defaultY), defaultYear, defaultX, defaultY, drawCountries)

  drawPCP(drawCountries,2010)
}

function resize() {
  //This function is called if the window is resized
  //You can update your scatterplot here
  viewWidth = window.innerWidth;
  viewHeight = window.innerHeight;
}

draw();