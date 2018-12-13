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

function initXY(v1, v2, v3, labelX, labelY) {
    //update
    chart.selectAll("g").remove()
    chart.selectAll("scatter-dots").remove();

    xValues = v1.map(element => element[v3] );
    yValues = v2.map(element => element[v3] );
    let xMax = d3.max(xValues)
    let yMax = d3.max(yValues)

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

    //TODO compor legendas
    chart.append("g")
        .attr("id", "xAxis")
        .attr("class", "x axis")
        .attr('transform', 'translate(0,' + scatterH + ')')
        .call(xAxis)

    chart.append("g")
        .attr("id", "yAxis")
        .attr("class", "y axis")
        .call(yAxis)

    var legend = chart.append("g")
        .attr("class", "legend");

    //legenda eixo X
    legend.append("text")
        .attr("x", scatterW)
        .attr("y", scatterH - 10)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(dataName(labelX));

    //legenda eixo Y
    legend.append("text")
        .attr("x", 15)
        .attr("y", -5)
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(dataName(labelY));

    return xMax;
}

function drawScatterplot(v1, v2, v3, labelX, labelY, selectedC) {

    xMax = initXY(v1, v2, v3, labelX, labelY)

    //there are selected countries to display
    if (selectedC.length != 0) {
        //filter countries
        selectedC.sort(function(a, b) {
            return a > b;
        });
        filtered_v1 = v1.filter(function (obj) { return selectedC.includes(obj['country']) })
        filtered_v2 = v2.filter(function (obj) { return selectedC.includes(obj['country']) })

        //create new arrays
        xValues = filtered_v1.map(element => element[v3] );
        yValues = filtered_v2.map(element => element[v3] );

        //remove old points
        points.remove()
    }
    //no countries means all countries!
    else {
        selectedC = v1.map(element => element.country );
    }

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

function updatePoints(v1, v2, v3, labelX, labelY) {

    initXY(v1, v2, v3, labelX, labelY)

    var transition = d3.transition()
        .duration(750)
        .ease(d3.easeCubic);

    points.transition(transition)
        .attr("cx", function (d, i) { return x(xValues[i]); }) // translate y value to a pixel
        .attr("cy", function (d, i) { return y(yValues[i]); }) // translate x value
        .style("fill", function (d, i) { return color(xValues[i] / d3.max(xValues)); })
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

    updatePoints(getArray(defaultB), getArray(defaultY), defaultYear, defaultB, defaultY);
}