var margin_pcp = { top: 66, right: 110, bottom: 20, left: 188 },
  width_pcp = document.body.clientWidth - margin_pcp.left - margin_pcp.right,
  height_pcp = 340 - margin_pcp.top - margin_pcp.bottom,
  innerHeight_pcp = height_pcp - 2;

/*
    TODO meter regioes da europa com estas cores ?
    var color = d3.scaleOrdinal()
      .domain(["Radial Velocity", "Imaging", "Eclipse Timing Variations", "Astrometry", "Microlensing", "Orbital Brightness Modulation", "Pulsar Timing", "Pulsation Timing Variations", "Transit", "Transit Timing Variations"])
      .range(["#DB7F85", "#50AB84", "#4C6C86", "#C47DCB", "#B59248", "#DD6CA7", "#E15E5A", "#5DA5B3", "#725D82", "#54AF52", "#954D56", "#8C92E8", "#D8597D", "#AB9C27", "#D67D4B", "#D58323", "#BA89AD", "#357468", "#8F86C2", "#7D9E33", "#517C3F", "#9D5130", "#5E9ACF", "#776327", "#944F7E"]);
*/

function getData(selectedC,year) {
  let data = [], obj, ind;

  if(selectedC.length != 0){
    //filter the countries
    a = assaults.filter(function(obj) { return selectedC.includes(obj['country']) })
    b = burglaries.filter(function(obj) { return selectedC.includes(obj['country']) })
    r = robberies.filter(function(obj) { return selectedC.includes(obj['country']) })
    h = homicides.filter(function(obj) { return selectedC.includes(obj['country']) })
    s = sexviolences.filter(function(obj) { return selectedC.includes(obj['country']) })    
  }
  else{
    a = assaults;
    b = burglaries;
    h = homicides;
    r = robberies;
    s = sexviolences;
  }
 
  for (ind = 0; ind < a.length; ind++) {
    obj = new Object();
    obj.country = a[ind]['country'];
    obj.assault = a[ind][year];
    obj.burglary = b[ind][year];
    obj.homicide = h[ind][year];
    obj.robbery = r[ind][year];
    obj.sexualViolence = s[ind][year];
    data.push(obj);
  }
  return data;
}

  var types = {
    "Number": {
      key: "Number",
      coerce: function (d) { return +d; },
      extent: d3.extent,
      within: function (d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
      defaultScale: d3.scaleLinear().range([innerHeight_pcp - 2, 0])
    },
    "String": {
      key: "String",
      coerce: String,
      extent: function (data) { return data.sort(); },
      within: function (d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
      defaultScale: d3.scalePoint().range([0, innerHeight_pcp - 2])
    }
  };

  var dimensions = [
    {
      key: "country",
      type: types["String"],
      axis: d3.axisLeft()
        .tickFormat(function (d, i) {
          return d;
        })
    },
    {
      key: "assault",
      type: types["Number"]
    },
    {
      key: "burglary",
      type: types["Number"]
    },
    {
      key: "homicide",
      type: types["Number"]
    },
    {
      key: "robbery",
      type: types["Number"]
    },
    {
      key: "sexualViolence",
      type: types["Number"]
    }
  ];

  var xscale = d3.scalePoint()
    .domain(d3.range(dimensions.length))
    .range([0, width_pcp]);

  var yAxis = d3.axisLeft();

  var container = d3.select("#main").append("div")
    .attr("class", "parcoords")
    .style("width", width_pcp + margin_pcp.left + margin_pcp.right + "px")
    .style("height", height_pcp + margin_pcp.top + margin_pcp.bottom + "px")

  var pcp = container.append("svg")
    .attr("width", width_pcp + margin_pcp.left + margin_pcp.right)
    .attr("height", height_pcp + margin_pcp.top + margin_pcp.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_pcp.left + "," + margin_pcp.top + ")");

  var canvas = container.append("canvas")
    .attr("width", width_pcp)
    .attr("height", height_pcp)
    .style("width", width_pcp + "px")
    .style("height", height_pcp + "px")
    .style("margin-top", margin_pcp.top + "px")
    .style("margin-left", margin_pcp.left + "px");

  var ctx = canvas.node()
    .getContext("2d");

  var axes = pcp.selectAll(".axis")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "axis")
    .attr("transform", function (d, i) { return "translate(" + xscale(i) + ")"; });


function drawPCP(selectedC,year) {

  //create data
  data = getData(selectedC,year)

  ctx.globalCompositeOperation = 'darken';
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1.5;
  //ctx.scale(devicePixelRatio, devicePixelRatio);  //TODO analisar isto

  data.forEach(function (d) {
    dimensions.forEach(function (p) {
      d[p.key] = !d[p.key] ? null : p.type.coerce(d[p.key]);
    });
  });

  // type/dimension default setting happens here
  dimensions.forEach(function (dim) {
    if (!("domain" in dim)) {
      // detect domain using dimension type's extent function
      dim.domain = d3_functor(dim.type.extent)(data.map(function (d) { return d[dim.key]; }));
    }
    if (!("scale" in dim)) {
      // use type's default scale for dimension
      dim.scale = dim.type.defaultScale.copy();
    }
    dim.scale.domain(dim.domain);
  });

  axes.append("g")
    .each(function (d) {
      var renderAxis = "axis" in d
        ? d.axis.scale(d.scale)  // custom axis
        : yAxis.scale(d.scale);  // default axis
      d3.select(this).call(renderAxis);
    })
    .append("text")
    .attr("class", "title")
    .attr("text-anchor", "start")
    .text(function (d) { return d.key; });

  // Add and store a brush for each axis.
  axes.append("g")
    .attr("class", "brush")
    .each(function (d) {
      d3.select(this).call(d.brush = d3.brushY()
        .extent([[-10, 0], [10, height_pcp]])
        .on("start", brushstart)
        .on("brush", brush)
        .on("end", brush)
      )
    })
    .selectAll("rect")
    .attr("x", -8)
    .attr("width", 16);

  /*d3.selectAll(".axis.pl_discmethod .tick text")
    .style("fill", color);*/

    updatePCP(selectedC,year);
    
}

function updatePCP(selectedC,year){
  let data = getData(selectedC,year)
  let render = renderQueue(draw_pcp).rate(30);
  ctx.clearRect(0, 0, width_pcp, height_pcp);
  ctx.globalAlpha = d3.min([1.15 / Math.pow(data.length, 0.3), 1]);
  render(data);
}

function project(d) {
  return dimensions.map(function (p, i) {
    // check if data element has property and contains a value
    if (
      !(p.key in d) ||
      d[p.key] === null
    ) return null;

    return [xscale(i), p.scale(d[p.key])];
  });
};

function draw_pcp(d) {
  //ctx.strokeStyle = color(d.pl_discmethod);
  ctx.beginPath();
  var coords = project(d);
  coords.forEach(function (p, i) {
    // this tricky bit avoids rendering null values as 0
    if (p === null) {
      // this bit renders horizontal lines on the previous/next
      // dimensions, so that sandwiched null values are visible
      if (i > 0) {
        var prev = coords[i - 1];
        if (prev !== null) {
          ctx.moveTo(prev[0], prev[1]);
          ctx.lineTo(prev[0] + 6, prev[1]);
        }
      }
      if (i < coords.length - 1) {
        var next = coords[i + 1];
        if (next !== null) {
          ctx.moveTo(next[0] - 6, next[1]);
        }
      }
      return;
    }

    if (i == 0) {
      ctx.moveTo(p[0], p[1]);
      return;
    }

    ctx.lineTo(p[0], p[1]);
  });
  ctx.stroke();
}

function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  render.invalidate();

  var actives = [];
  pcp.selectAll(".axis .brush")
    .filter(function (d) {
      return d3.brushSelection(this);
    })
    .each(function (d) {
      actives.push({
        dimension: d,
        extent: d3.brushSelection(this)
      });
    });

  var selected = data.filter(function (d) {
    if (actives.every(function (active) {
      var dim = active.dimension;
      // test if point is within extents for each active brush
      return dim.type.within(d[dim.key], active.extent, dim);
    })) {
      return true;
    }
  });

  //aquele comentario gigante estava aqui

  ctx.clearRect(0, 0, width_pcp, height_pcp);
  ctx.globalAlpha = d3.min([0.85 / Math.pow(selected.length, 0.3), 1]);
  render(selected);
}

function d3_functor(v) {
  return typeof v === "function" ? v : function () { return v; };
};

 // show ticks for active brush dimensions
      // and filter ticks to only those within brush extents
      /*
      pcp.selectAll(".axis")
          .filter(function(d) {
            return actives.indexOf(d) > -1 ? true : false;
          })
          .classed("active", true)
          .each(function(dimension, i) {
            var extent = extents[i];
            d3.select(this)
              .selectAll(".tick text")
              .style("display", function(d) {
                var value = dimension.type.coerce(d);
                return dimension.type.within(value, extent, dimension) ? null : "none";
              });
          });
  
      // reset dimensions without active brushes
      pcp.selectAll(".axis")
          .filter(function(d) {
            return actives.indexOf(d) > -1 ? false : true;
          })
          .classed("active", false)
          .selectAll(".tick text")
            .style("display", null);
      */
