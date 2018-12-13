d3.select("#left")
    .style('width', leftContW + 'px')
    .style('height', sliderH + scatterH + 'px')

var svg = d3.select("#slider")
    .attr("width", leftContW)
    .attr("height", sliderH)
    .style('background', '#C1E1EC')
    //.attr("transform", "translate(0," + margin.top  + ")")
    .append("g");

function sliderYears() {

    var x = d3.scaleLinear()
        .domain([2010, 2015])
        .range([0, width / 4])  //????
        .clamp(true);

    //cria 'eixo'
    var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
        defaultYear = Math.round(h);
        handle.attr("cx", x(defaultYear));
        updateMap(getArray(defaultB), defaultYear)
        updatePoints(getArray(defaultB), getArray(defaultY), defaultYear, defaultB, defaultY)        
        updatePCP(drawCountries, defaultYear)
    }
}