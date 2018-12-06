var viewWidth = window.innerWidth;
var viewHeight = window.innerHeight;
d3.select(window).on("resize", resize);

var margin = { top: 20, right: 20, bottom: 30, left: 40 };
var width = (viewWidth - margin.left - margin.right)/2
var height = (viewHeight - margin.top - margin.bottom)/2

/*var svg = d3.select("svg")
    .attr("width",viewWidth)
    .attr("height", viewHeight)
    .append("g")
    .style("background", '#C1E1EC')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");*/

var chart = d3.select("svg")
    .attr('width', width + 50)
    .attr('height', height + 50)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var assaults = assault.countries;
var burglaries = burglary.countries;
var homicides = homicide.countries;
var sexviolences = sexualviolence.countries;
var robberies = robbery.countries;    

var defaultX = "assault";
var defaultY = "sexualviolence";
var defaultYear = 2010;
var points,x,y,xAxis,yAxis;
var xValues = [];
var yValues = [];

function draw() {

    drawScatterplot(getArray(defaultX), getArray(defaultY), defaultYear)
}

function getArray(valueName) {
    if (valueName == "assault")
        return assaults;
    if (valueName == "burglary")
        return burglaries;
    if (valueName == "homicide")
        return homicides;
    if (valueName == "sexualviolence")
        return sexviolences;
    if (valueName == "robbery")
        return robberies;
}

function initXY(v1,v2,v3){
    // draw the graph object
    let index = 0;
    // TODO compor para os indices serem de acordo com o array que recebe
    for (index = 0; index < v1.length; index++) {
        xValues[index] = v1[index][v3];
        yValues[index] = v2[index][v3];
    }

    x = d3.scaleLinear()
        .domain([0, d3.max(xValues)])  // the range of the values to plot
        .range([0, width]);        // the pixel range of the x-axis

    y = d3.scaleLinear()
        .domain([0, d3.max(yValues)])
        .range([height, 0]);

    xAxis = d3.axisBottom()
        .scale(x);

    yAxis = d3.axisLeft()
        .scale(y);

    /*var xExtent = d3.extent(xValues, function(d) { return d[xValues]; });
    var yExtent = d3.extent(yValues, function(d) { return d[yValues]; });
      
    x.domain(xExtent).nice();
    y.domain(yExtent).nice();*/

    //TODO compor legendas
    chart.append("g")
      .attr("id", "xAxis")
      .attr("class", "x axis")
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("id", "xLabel")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("boas");

    chart.append("g")
      .attr("id", "yAxis")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("id", "yLabel")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("boas");
}

function drawScatterplot(v1, v2, v3) {

    initXY(v1, v2, v3)

    points = chart.selectAll("scatter-dots")
        .data(v1)
        .enter().append("svg:circle")  // create a new circle for each value
        .attr("cx", function (d, i) { return x(xValues[i]); }) // translate y value to a pixel
        .attr("cy", function (d, i) { return y(yValues[i]); }) // translate x value
        .attr("r", 5) // radius of circle
        .style("opacity", 0.6); // opacity of circle
}

function updatePoints(v1, v2, v3) {

    initXY(v1, v2, v3)

    //TODO ver das legendas
    /*d3.select("#xLabel").text(dataName(v1));
    d3.select("#yLabel").text(dataName(v2));
  
    d3.select("#xAxis").call(xAxis);
    d3.select("#yAxis").call(yAxis);*/

    var transition = d3.transition()
        .duration(750)
        .ease(d3.easeCubic);

    points.transition(transition)
        .attr("cx", function (d, i) { return x(xValues[i]); }) // translate y value to a pixel
        .attr("cy", function (d, i) { return y(yValues[i]); }) // translate x value
}

function dataName(v) {

    if (v == "assault")
        return "Assault";
    else if (v == "burglary")
        return "Burglary";
    else if (v == "homicide")
        return "Homicide";
    else if (v == "robbery")
        return "Robbery";
    else if (v == "sexualviolence")
        return "Sexual Violence";
}

function selectVariable(id) {

    var variable;
    console.log(id)

    if (id === 0) {
        var e = document.getElementById("xAxisItem");
        defaultX = e.options[e.selectedIndex].value;
    }

    if (id === 1) {
        var e = document.getElementById("yAxisItem");
        defaultY = e.options[e.selectedIndex].value;
    }

    if (id === 2) {
        var e = document.getElementById("Year");
        defaultYear = e.options[e.selectedIndex].value;
    }

    updatePoints(getArray(defaultX), getArray(defaultY), defaultYear);
}

// TODO compor isto e meter como no main

function resize() {

    viewWidth = window.innerWidth;
    viewHeight = window.innerHeight;

    /* width = viewWidth - margin.left - margin.right;
     height = viewHeight - margin.top - margin.bottom;
 
     x.range([0, width]);
     y.range([height, 0]);
 
     xAxis.scale(x);
     yAxis.scale(y);
 
     d3.select("#container")
         .attr("width", viewWidth);
 
     d3.select("#vis")
         .attr("width", viewWidth)
         .attr("height", viewHeight);
 
     d3.select("svg")
         .attr("width", viewWidth)
         .attr("height", viewHeight);*/


    // drawScatterplot(xValue, yValue, );
}

draw()