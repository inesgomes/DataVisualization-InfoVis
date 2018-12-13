d3.select(window).on("resize", resize);

function draw() {
  sliderYears()
  drawScatterplot(getArray(defaultX), getArray(defaultY), defaultYear, defaultX, defaultY, drawCountries)
  drawMap(assaults, defaultYear)
  drawPCP(drawCountries,defaultYear)
}

function resize() {
  //This function is called if the window is resized
  //You can update your scatterplot here
  viewWidth = window.innerWidth;
  viewHeight = window.innerHeight;
}

draw();