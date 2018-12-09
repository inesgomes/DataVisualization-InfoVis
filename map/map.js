var margin_map = { top: 20, right: 20, bottom: 30, left: 40 };
var width_map = window.innerWidth/2  - margin_map.left - margin_map.right;;
var height_map = window.innerHeight - margin_map.top - margin_map.bottom;

var map = d3.select("#map")
  .attr("width", width_map)
  .attr("height", height_map)
  
  .style('background', '#fdae6b')
  .attr("transform", "translate(0," + margin_map.top + ")")
  .append("g");

var color = d3.scaleLinear()
  .clamp(true)
  .domain([0, 0.2, 0.4, 0.6, 0.8, 1])
  .range(['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#e6550d', '#a63603'])
  .interpolate(d3.interpolateHcl);

function drawMap(crimes, year) {

  var countries;
  var center = [40, 50];

  //make array with values of crime in one year and finding max for color diff
  let i, maxValues = [];
  for (i = 0; i < crimes.length; i++) {
    maxValues[i] = crimes[i][year]
  }
  var max = d3.max(maxValues);
  console.log(max)

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
    var legend = map.selectAll("g.legend")
      .data([0, 0.2, 0.4, 0.6, 0.8, 1])
      .enter().append("g")
     
      .attr("class", "legend");

    var ls_w = 15, ls_h = 15;

    legend.append("rect")
      .attr("x", width_map/4)
      .attr("y", function (d, i) { return height_map*7/10 - (i * ls_h) - 2 * ls_h; })
      .attr("width", ls_w)
      .attr("height", ls_h)
     
      .style("fill", function (d, i) { return color(d); })
      .style("opacity", 0.8)
     // .attr("transform", "translate(0," + margin_map.top*2  + ")");

    legend.append("text")
      .attr("x", width_map/4+20)
      .attr("y", function (d, i) { return height_map*7/10 - (i * ls_h) - ls_h - 4; })
      .text(function (d, i) { return legend_labels[i]; });


    return;
  });

  this.map = map;
  this.projection = projection;

}