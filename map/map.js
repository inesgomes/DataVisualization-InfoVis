var map = d3.select("#map")
  .attr("width", mapW)
  .attr("height", mapH)
  .style('background', '#fdae6b')
  //.attr("transform", "translate(0," + margin_map.top + ")")
  .append("g");

var body=d3.select("body");

var rangeColor=[
    ['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#e6550d', '#a63603'], //laranja
    ['#eff3ff','#c6dbef','#9ecae1','#6baed6','#3182bd','#08519c'], //azul 
    ['#edf8e9','#c7e9c0','#a1d99b','#74c476','#31a354','#006d2c'], //verde
    ['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15'], //vermelho
    ['#f2f0f7','#dadaeb','#bcbddc','#9e9ac8','#756bb1','#54278f']   //roxo
];
var numRangeColor = 0;
var color = d3.scaleLinear()
  .clamp(true)
  .domain([0, 0.2, 0.4, 0.6, 0.8, 1])
  .range(rangeColor[numRangeColor])
  .interpolate(d3.interpolateHcl);

  var tooltip = body //for hover
  .append("div")
  .attr("class", "tooltip hidden");

function drawMap(crimes, year) {

  var countries;
  var center = [50, 50];

  //make array with values of crime in one year and finding max for color diff
  let i, maxValues = [];
  for (i = 0; i < crimes.length; i++) {
    maxValues[i] = crimes[i][year]
  }
  var max = d3.max(maxValues);

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
      .attr("fill", function (d) {
        //find country name in map list and color it
        c = crimes.filter(function(obj) { return obj['country'] == d.properties.NAME })
        if(c.length != 0){
          let diff = c[0][year] * 1 / max;
          return color(diff);
        }
        return 'lightgray';
      })
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
        drawScatterplot(getArray(defaultX), getArray(defaultY), defaultYear, defaultX, defaultY, drawCountries)
        updatePCP(drawCountries,defaultYear)
      })
      .on("mousemove", showTooltipPoint) //hover in
      .on("mouseout", hideTooltipPoint) //hover out

    //Fazer legenda
    var legend_labels = ["<20%", "+20%", "+40%", "+60%", "+80%", "100%"]
    var legend = map.selectAll("g.legend")
      .data([0, 0.2, 0.4, 0.6, 0.8, 1])
      .enter().append("g")
      .attr("class", "legend");

    var ls_w = 15, ls_h = 15;

    legend.append("rect")
      .attr("x", mapW*0.2) 
      .attr("y", function (d, i) { return mapH*0.75 - (i * ls_h) - 2 * ls_h; })
      .attr("width", ls_w)
      .attr("height", ls_h)
      .style("fill", function (d, i) { return color(d); })
      .style("opacity", 0.8)
     // .attr("transform", "translate(0," + margin_map.top*2  + ")");

    legend.append("text")
      .attr("x", mapW*0.2+20) 
      .attr("y", function (d, i) { return mapH*0.75 - (i * ls_h) - ls_h - 4; })
      .text(function (d, i) { return legend_labels[i]; });

    return;
  });

  this.map = map;
  this.projection = projection;

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