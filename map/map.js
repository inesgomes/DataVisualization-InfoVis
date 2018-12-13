d3.select("#right")
  .style('width', mapW + 'px')
  .style('height', mapH + margin.bottom + 'px')

var map = d3.select("#map")
  .attr("width", mapW)
  .attr("height", mapH)
  .style('background', '#fdae6b')
  //.attr("transform", "translate(0," + margin_map.top + ")")
  .append("g");

var body = d3.select("body");

var tooltip = body //for hover
  .append("div")
  .attr("class", "tooltip hidden");

var legend;
var countries;
function drawMap(crimes, year) {

  var center = [50, 50];

  //begin map
  var projection = d3.geoMercator()
    // .translate([width_map,height_map])
    .scale(310)
    .center(center);

  var path = d3.geoPath()
    .projection(projection);

  countries = map.append("g");
  //load map info 
  d3.json('../data/europe.json', function (data) {
    countries.selectAll('.country')
      .data(topojson.feature(data, data.objects.europe).features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .on("click", function (d) {
        let elem = d3.select(this);
        //TODO retirar clicked do elem
        elem.classed("clicked", true)
          .attr("fill", "gray");
        //add name
        let name = d.properties.NAME
        if (!(drawCountries.includes(name))) {
          drawCountries.push(name)
        }
        drawScatterplot(getArray(defaultB), getArray(defaultY), defaultYear, defaultB, defaultY, drawCountries)
        updatePCP(drawCountries, defaultYear)
      })
      .on("mousemove", showTooltipPoint) //hover in
      .on("mouseout", hideTooltipPoint) //hover out

    //Fazer legenda
    var legend_labels = ["<20%", "+20%", "+40%", "+60%", "+80%", "100%"]
    legend = map.selectAll("g.legend")
      .data([0, 0.2, 0.4, 0.6, 0.8, 1])
      .enter().append("g")
      .attr("class", "legend");

    legend.append("rect")
      .attr("x", mapW * 0.2)
      .attr("y", function (d, i) { return mapH * 0.75 - (i * ls_h) - 2 * ls_h; })
      .attr("width", ls_w)
      .attr("height", ls_h)
      .style("opacity", 0.8)
      //.style("fill", function (d, i) { return color(d); })
    // .attr("transform", "translate(0," + margin_map.top*2  + ")");

    updateMap(crimes, year);

    legend.append("text")
      .attr("x", mapW * 0.2 + 20)
      .attr("y", function (d, i) { return mapH * 0.75 - (i * ls_h) - ls_h - 4; })
      .text(function (d, i) { return legend_labels[i]; });
    
    return;
  });

  this.map = map;
  this.projection = projection;

}

function updateMap(crimes, year){
  let i, maxValues = [];
  for (i = 0; i < crimes.length; i++) {
    maxValues[i] = crimes[i][year]
  }
  var max = d3.max(maxValues);

    countries.selectAll('.country')
      .attr("fill", function (d) {
          //find country name in map list and color it
          c = crimes.filter(function (obj) { return obj['country'] == d.properties.NAME })
          if (c.length != 0) {
            let diff = c[0][year] * 1 / max;
            return color(diff);
          }
          return 'lightgray';
        })
        legend.append("rect")
        .attr("x", mapW * 0.2)
        .attr("y", function (d, i) { return mapH * 0.75 - (i * ls_h) - 2 * ls_h; })
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function (d, i) { return color(d); })
        //.style("opacity", 0.8)
      // .attr("transform", "translate(0," + margin_map.top*2  + ")");
}

function selectBotton() {

    var e = document.getElementById("botton");
    console.log(e)
    defaultB = e.options[e.selectedIndex].value;
    console.log(defaultB)
    console.log(e.selectedIndex)

  color = d3.scaleLinear()
    .clamp(true)
    .domain([0, 0.2, 0.4, 0.6, 0.8, 1])
    .range(rangeColor[e.selectedIndex])
    .interpolate(d3.interpolateHcl);
    updateMap(getArray(defaultB), defaultYear)
    updatePoints(getArray(defaultB), getArray(defaultY), defaultYear, defaultB, defaultY)
 }

function showTooltipPoint(d) {
  var mouse = d3.mouse(body.node()).map(function (d) { return parseInt(d); });
  tooltip.classed('hidden', false) //make tooltip visible
    .html(d.properties.NAME) //display the name of point
    .attr('style', //set size of the tooltip
      'left:' + (mouse[0] + 15) + 'px; top:' + (mouse[1] - 35) + 'px')
};

function hideTooltipPoint(d) {
  tooltip.classed('hidden', true); //hide tooltip
}