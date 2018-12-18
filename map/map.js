var legScaleW = mapW * 0.05;
var legScaleH = panelH * 0.945;

d3.select("#right")
  .style('height', panelH + 'px')

var map = d3.select("#map")
  .attr("width", mapW)
  .attr("height", mapH - margin.bottom + 5)
  .style('position', 'absolute')
  .attr("transform", "translate(-160, 0)")
  .append("g");

var body = d3.select("body");

var tooltip = body //for hover
  .append("div")
  .attr("class", "tooltip hidden");

var legend;
var countries;

function drawMap(crimes, year) {

  var center = [60, 49];

  //begin map
  var projection = d3.geoMercator()
    // .translate([width_map,height_map])
    .scale(320)
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
      .on("click", clickCountry)
      .on("mousemove", showTooltipPoint) //hover in
      .on("mouseout", hideTooltipPoint) //hover out

    //Fazer legenda
    var legend_labels = ["no data", "selected", "<20%", "+20%", "+40%", "+60%", "+80%", "100%"]
    legend = map.selectAll("g.legend")
      .data([-2,-1, 0, 0.2, 0.4, 0.6, 0.8, 1])
      .enter().append("g")
      .attr("class", "legend");

    updateMap(crimes, year);

    legend.append("text")
      .attr("x", legScaleW + 20)
      .attr("y", function (d, i) { return legScaleH - (i * ls_h) - ls_h - 4; })
      .text(function (d, i) { return legend_labels[i]; });

    return;
  });

  this.map = map;
  this.projection = projection;
}

function clickCountry(d) {
  let elem = d3.select(this);
  let name = d.properties.NAME

  if (elem.classed("nodata")) return;

  //verify if element has been already clicked to unselect
  if (elem.classed("clicked")) {
    //remove clicked class
    elem.classed("clicked", false)
    //remove name to array of selected countries
    let index = drawCountries.indexOf(name);
    if (index > -1) drawCountries.splice(index, 1);
  }
  else {
    //add clicked class
    elem.classed("clicked", true);
    //add name to array of selected countries
    if (!(drawCountries.includes(name))) drawCountries.push(name)
  }

  //update all
  drawScatterplot(defaultB, defaultY, defaultYear, drawCountries) //this is a bug fix
  updateDraw();
}

function updateMap(crimes, year) {
  let i, maxValues = [];
  for (i = 0; i < crimes.length; i++) {
    maxValues[i] = crimes[i][year]
  }
  var max = d3.max(maxValues);

  countries.selectAll('.country').attr("fill", function (d) {
    //find country name in map list and color it
    c = crimes.filter(function (obj) { return obj['country'] == d.properties.NAME })
    if (c.length != 0) return color(c[0][year] / max);

    //country doesn't have data
    let elem = d3.select(this);
    elem.classed("nodata", true);
    return noDataColor;
  })

  legend.append("rect")
    .attr("x", legScaleW)
    .attr("y", function (d, i) { return legScaleH - (i * ls_h) - 2 * ls_h; })
    .attr("width", ls_w)
    .attr("height", ls_h)
    .style("fill", function (d, i) { return color(d); })
}

function content(v) {

  if (v == "assault")
    return `Physical attack against the body of another person resulting in serious bodily injury,
       excluding indecent/sexual assault, threats and slapping/punching. 'Assault' leading to death should also 
       be excluded.`
  else if (v == "burglary")
    return `Gaining unauthorised access to a part of a building/dwelling or other premises, 
      including by use of force, with the intent to steal goods (breaking and entering). 
      “Burglary” should include, where possible, theft from a house, appartment or other dwelling place, 
      factory, shop or office, from a military establishment, or by using false keys. It should exclude theft 
      from a car, from a container, from a vending machine, from a parking meter and from fenced meadow/compound.`
  else if (v == "homicide")
    return `Unlawful death purposefully inflicted on a person by another person. Data on intentional homicide
       should also include serious assault leading to death and death as a result of a terrorist attack. 
       It should exclude attempted homicide, manslaughter, death due to legal intervention, justifiable homicide 
       in self-defence and death due to armed conflict.`
  else if (v == "robbery")
    return `Theft of property from a person, overcoming resistance by force or threat of force.
       Where possible, the category “Robbery” should include muggings (bag-snatching) and theft with violence,
        but should exclude pick pocketing and extortion.`
  else if (v == "sexualviolence")
    return `Rape and sexual assault, including Sexual Offences against Children.`
}

function selectCrime(type, id) {
  //update type
  defaultB = type
  //change color
  color = d3.scaleLinear()
    .clamp(true)
    .domain([-2,-1, 0, 0.2, 0.4, 0.6, 0.8, 1])
    .range(rangeColor[id])
    .interpolate(d3.interpolateHcl);
  //update html
  document.getElementById('header').textContent = dataName(defaultB)
  document.getElementById('content').textContent = content(defaultB)
  document.getElementById('bmap').textContent = dataName(defaultB)
  //update graphics
  updateDraw();
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