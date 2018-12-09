var viewWidth = window.innerWidth;
var viewHeight = window.innerHeight;
d3.select(window).on("resize", resize);

var margin = { top: 20, right: 20, bottom: 30, left: 40 };
var width = (viewWidth - margin.left - margin.right)/2
var height = (viewHeight - margin.top - margin.bottom)/2


var assaults = assault.countries;
var burglaries = burglary.countries;
var homicides = homicide.countries;
var sexviolences = sexualviolence.countries;
var robberies = robbery.countries;    



function draw() {

    drawScatterplot(getArray(defaultX), getArray(defaultY), defaultYear, defaultX, defaultY)
}



draw()