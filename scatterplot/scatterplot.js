d3.select("#containerSP")
    .style('width', leftContW + 'px')
    .style('height', scontainerH + 'px')
    .style('display', 'block')
    .style('background', 'lightblue')

var chart = d3.select("#scatterplot")
    .attr('width', scatterW + 60)
    .attr('height', scatterH + 50)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .style("margin-bottom", margin.bottom + "px")


d3.select("#selectionUI")
    .style("margin-left", margin.left + "px")
    .style("margin-bottom", margin.bottom + "px")

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
    //new countries added or removed
    if(selectedC.length != 0){
        //remove old points
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
        .on("mousemove", function (d, i) {
            var mouse = d3.mouse(body.node()).map(function (d) { return parseInt(d); });
            tooltipS.classed('hidden', false) //make tooltip visible
                .html(selectedC[i]) //display the name of point
                .attr('style', //set size of the tooltip
                    'left:' + (mouse[0] + 15) + 'px; top:' + (mouse[1] - 35) + 'px')
        }) //hover in
        .on("mouseout", function () {
            tooltipS.classed('hidden', true); //hide tooltip
        }) //hover out
}

function updatePoints(xName, yName, year, selectedC) {

    //get variables (not labels)
    xVar = getArray(xName);
    yVar = getArray(yName);
    //transform variables and create/update axis
    xMax = initXY(xVar, yVar, xName, yName, year, selectedC)
    //filter per selected countries
    selectedC = filterCountries(xVar, yVar, year, selectedC)

    console.log("UPDATE POINTS")
    console.log(xValues)
    console.log(yValues)

    //draw
    var transition = d3.transition()
        .duration(750)
        .ease(d3.easeCubic);

    points.transition(transition)
        .attr("cx", function (d, i) { return x(xValues[i]); }) // translate y value to a pixel
        .attr("cy", function (d, i) { return y(yValues[i]); }) // translate x value
        .style("fill", function (d, i) { return color(xValues[i] / xMax); })    //if X changes, must update color
        .style("stroke", color(1))
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

    if (id === 1) {
        var e = document.getElementById("yAxisItem");
        defaultY = e.options[e.selectedIndex].value;
    }

    updatePoints(defaultB, defaultY, defaultYear, drawCountries);
}