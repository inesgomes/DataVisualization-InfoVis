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

function draw() {
  sliderYears()
  drawScatterplot(getArray(defaultX), getArray(defaultY), defaultYear, defaultX, defaultY, drawCountries)
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