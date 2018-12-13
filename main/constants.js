//SIZES 
var margin = { top: 20, right: 20, bottom: 30, left: 40 };
var width =  window.innerWidth - margin.left - margin.right;
var height = window.innerHeight - margin.top - margin.bottom;

var rightContW = window.innerWidth*0.6 - margin.right; //need to have some margin between 
var sliderH = window.innerHeight*0.1;
var scontainerH = window.innerHeight*0.7;
var scatterW = rightContW*0.95 - margin.left
var scatterH = scontainerH*0.75 - margin.top - margin.bottom
var mapW = window.innerWidth*0.4 - margin.right;
var mapH = window.innerHeight*0.8;
var pcpW = window.innerWidth*0.8;
var pcpH = window.innerHeight*0.4;

//JSONS
var assaults = assault.countries;
var burglaries = burglary.countries;
var homicides = homicide.countries;
var robberies = robbery.countries;
var sexviolences = sexualviolence.countries;

//INIT values
var defaultX = "assault";
var defaultY = "sexualviolence";
var defaultYear = 2010;

//OTHER variables
var drawCountries=[];
var points,x,y,xAxis,yAxis;
var xValues = [];
var yValues = [];  