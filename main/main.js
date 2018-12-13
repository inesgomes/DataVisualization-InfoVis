d3.select(window).on("resize", resize);

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

function sortJsons(){
  assaults.sort(function(a, b) {
    return a.country > b.country;
  });
  burglaries.sort(function(a, b) {
    return a.country > b.country;
  });
  homicides.sort(function(a, b) {
    return a.country > b.country;
  });
  sexviolences.sort(function(a, b) {
    return a.country > b.country;
  });
  robberies.sort(function(a, b) {
    return a.country > b.country;
  });
}

function draw() {
  sortJsons()
  sliderYears()
  drawScatterplot(defaultB, defaultY, defaultYear, drawCountries)
  drawMap(getArray(defaultB), defaultYear)
  drawPCP(drawCountries,defaultYear)
}

function resize() {
  //This function is called if the window is resized
  //You can update your scatterplot here
  viewWidth = window.innerWidth;
  viewHeight = window.innerHeight;
}

draw();