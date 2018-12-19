d3.select("#containerSP")
    .style('width', leftContW + 'px')
    .style('height', panelH + 'px')
    .style('display', 'block')

var chart = d3.select("#scatterplot")
    .attr('width', scatterW + 50)
    .attr('height', scatterH + 50)
    .append('g')
    .attr('transform', 'translate(' + 4*margin.left/3 + ',' + margin.top + ')')
    .style("margin-top", margin.top + "px")

var legScat = d3.select("#legScatter")
    .attr('width', leftContW )
    .attr('height', sliderH/2)
    .append('g')
    .attr('transform', 'translate(' + margin.left*3.5 + ',' + margin.top/2 + ')')
    

d3.select("#selectionUI")
//.style("margin-left", margin.left + "px")
//.style("margin-bottom", margin.bottom + "px")

var body = d3.select("body");

var tooltipS = body //for hover
    .append("div")
    .attr("class", "tooltip hidden");

function initXY(xVar, yVar, xName, yName, year) {

    //some computations
    xValues = xVar.map(element => element[year]);
    yValues = yVar.map(element => element[year]);

    let xMax = d3.max(xValues)
    let yMax = d3.max(yValues)

    //scale Axis
    scaleAxis(xMax, yMax, xName, yName)
    return xMax;
}

function scaleAxis(xMax, yMax, xName, yName) {

    //scales and axis
    x = d3.scaleLinear()
        .domain([0, xMax])  // the range of the values to plot
        .range([0, scatterW]);        // the pixel range of the x-axis

    y = d3.scaleLinear()
        .domain([0, yMax])
        .range([scatterH, 0]);

    xAxis = d3.axisBottom()
        .scale(x);

    yAxis = d3.axisLeft()
        .scale(y);

    /*var xExtent = d3.extent(xValues, function(d) { return d[xValues]; });
    var yExtent = d3.extent(yValues, function(d) { return d[yValues]; });
    
    x.domain(xExtent).nice();
    y.domain(yExtent).nice();*/

    //update chart
    chart.selectAll("g").remove()
    chart.selectAll("scatter-dots").remove();

    //create axis
    chart.append("g")
        .attr("id", "xAxis")
        .attr("class", "x axis")
        .attr('transform', 'translate(0,' + scatterH + ')')
        .call(xAxis)

    chart.append("g")
        .attr("id", "yAxis")
        .attr("class", "y axis")
        .call(yAxis)

    //create legends
    var legend = chart.append("g")
        .attr("class", "legend");

    //legenda eixo X
    legend.append("text")
        .attr("x", scatterW)
        .attr("y", scatterH - 10)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(dataName(xName));

    //legenda eixo Y
    legend.append("text")
        .attr("x", 15)
        .attr("y", -5)
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(dataName(yName));
}

function filterCountries(xVar, yVar, year, selectedC) {

    //filter: when there are selected countries
    if (selectedC.length != 0) {
        //sort
        selectedC.sort(function (a, b) {
            return a > b;
        });
        //filter values
        filtered_X = xVar.filter(function (obj) { return selectedC.includes(obj['country']) })
        filtered_Y = yVar.filter(function (obj) { return selectedC.includes(obj['country']) })

        //update displayed values
        xValues = filtered_X.map(element => element[year]);
        yValues = filtered_Y.map(element => element[year]);
    }
    //no selected countries means all countries!
    else {
        selectedC = xVar.map(element => element.country);
    }
    return selectedC;
}

function drawScatterplot(xName, yName, year, selectedC) {
    //remove old points
    if (points != null) {
        points.remove()
    }

    //get variables (not labels)
    xVar = getArray(xName);
    yVar = getArray(yName);
    //transform variables and create/update axis
    xMax = initXY(xVar, yVar, xName, yName, year, selectedC)
    //filter per selected countries
    selectedC = filterCountries(xVar, yVar, year, selectedC)

    //draw
    points = chart.selectAll("scatter-dots")
        .data(xValues)
        .enter().append("svg:circle")  // create a new circle for each value
        .attr("class", "circle")
        .attr("cx", function (d, i) { return x(xValues[i]); }) // translate y value to a pixel
        .attr("cy", function (d, i) { return y(yValues[i]); }) // translate x value
        .attr("r", 5) // radius of circle
        .style("opacity", 0.6) // opacity of circle
        .style("stroke", color(1))
        .style("fill", function (d, i) { return color(xValues[i] / xMax); })
        .on("mousemove", function (d, i) { //wolverin
            var mouse = d3.mouse(body.node()).map(function (d) { return parseInt(d); });
            tooltipS.classed('hidden', false) //make tooltip visible
                .html(selectedC[i]) //display the name of point
                .attr('style', //set size of the tooltip
                    'left:' + (mouse[0] + 15) + 'px; top:' + (mouse[1] - 35) + 'px')
        })
        .on("mouseout", function () { //hover out
            tooltipS.classed('hidden', true); //hide tooltip
        });
        legScat.append("text")
            .style("font-size", "10px")
            .text(function (d) { return "Relation between " + dataName(xName) + " and " + dataName(yName) + " with rate per 100 000 population" })

}

function updatePoints(xName, yName, year, selectedC) {

    //get variables (not labels)
    xVar = getArray(xName);
    yVar = getArray(yName);
    //transform variables and create/update axis
    xMax = initXY(xVar, yVar, xName, yName, year, selectedC)
    //filter per selected countries
    selectedC = filterCountries(xVar, yVar, year, selectedC)

    //draw
    var transition = d3.transition()
        .duration(750)
        .ease(d3.easeCubic);

    points.transition(transition)
        .attr("cx", function (d, i) { return x(xValues[i]); }) // translate y value to a pixel
        .attr("cy", function (d, i) { return y(yValues[i]); }) // translate x value
        .style("fill", function (d, i) { return color(xValues[i] / xMax); })    //if X changes, must update color
        .style("stroke", color(1))
    
    legScat.selectAll("text").remove()
    legScat.append("text")
    .style("font-size", "10px")
    .text(function (d) { return "Relation between " + dataName(xName) + " and " + dataName(yName) + " with rate per 100 000 population" })

}

function selectYaxis(name, id) {
    document.getElementById('bscatter').textContent = dataName(name);
    defaultY = name;
    updatePoints(defaultB, name, defaultYear, drawCountries);
}