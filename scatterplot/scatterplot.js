// PERGUNTAR BÁRBARA: como limpar o scatterplot quando quisermos selecionar paises (e como des'selecionar paises)


/*
var marginChart = { top: 20, right: 20, bottom: 30, left: 40 };
var widthChart = width*0.65 //(window.innerWidth - marginChart.left - marginChart.right)/2
var heightChart = height    //(window.innerHeight/2 - marginChart.top - marginChart.bottom)*/

var defaultX = "assault";
var defaultY = "sexualviolence";
var defaultYear = 2011;
var points,x,y,xAxis,yAxis;
var xValues = [];
var yValues = [];  
/*
var selectionUI = d3.select("#selectionUI")
    .attr('width', widthChart + 50)
   .attr('height', heightChart + 50)
    .attr('transform', 'translate(' + marginChart.left + ',' + marginChart.top + ')')
   // .style('background', 'red')
  */  
 console.log(scatterW)
var container = d3.select("#containerSP")
    .style('width', scatterW + 'px')
    .style('height', scatterH + 'px')
    .style('background', 'red')
    .style('display','block')
    //.attr('transform', 'translate(' + marginChart.left + ',' + marginChart.top + ')')

var chart = container.select("#scatterplot")
    .attr('width', scatterW)
    .attr('height', scatterH)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .append('g')

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

function initXY(v1,v2,v3,labelX,labelY){
    // draw the graph object
 
    let index = 0;
    // TODO compor para os indices serem de acordo com o array que recebe
    for (index = 0; index < v1.length; index++) {
        xValues[index] = v1[index][v3];
        yValues[index] = v2[index][v3];
    }

    chart.selectAll("g").remove();
    chart.selectAll("scatter-dots").remove();

    x = d3.scaleLinear()
        .domain([0, d3.max(xValues)])  // the range of the values to plot
        .range([0, scatterW]);        // the pixel range of the x-axis

    y = d3.scaleLinear()
        .domain([0, d3.max(yValues)])
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
      .attr("x", scatterW )
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

   
}

function drawScatterplot(v1, v2, v3, labelX, labelY, selectedC) {
    let data = []
    
    initXY(v1, v2, v3, labelX, labelY)

    if(selectedC.length == 0){
        data=v1
    }

    else{
        data=selectedC
        filtered_v1 = v1.filter(function(obj) { return selectedC.includes(obj['country']) })
        filtered_v2 = v2.filter(function(obj) { return selectedC.includes(obj['country']) })
        let ind = 0
        for(ind = 0; ind< filtered_v1.length; ind++){
            xValues[ind] = filtered_v1[ind][v3] 
            yValues[ind] = filtered_v2[ind][v3] 
        }
    }

    if(points != null){
        chart.selectAll("scatter-dots").remove();
    }
        

    points = chart.selectAll("scatter-dots")
        .data(data)
        .enter().append("svg:circle")  // create a new circle for each value
        .attr("class", "circle")
        .attr("cx", function (d, i) { return x(xValues[i]); }) // translate y value to a pixel
        .attr("cy", function (d, i) { return y(yValues[i]); }) // translate x value
        .attr("r", 5) // radius of circle
        .style("opacity", 0.6); // opacity of circle
}

function updatePoints(v1, v2, v3, labelX, labelY) {
  
    initXY(v1, v2, v3, labelX, labelY)

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

    updatePoints(getArray(defaultX), getArray(defaultY), defaultYear, defaultX, defaultY);
}

