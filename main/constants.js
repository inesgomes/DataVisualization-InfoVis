//SIZES 
var margin = { top: 20, right: 20, bottom: 30, left: 40 };
var width = window.innerWidth - margin.left - margin.right;
var height = window.innerHeight - margin.top - margin.bottom;

var rightContW = window.innerWidth * 0.6 - margin.right; //need to have some margin between 
var sliderH = window.innerHeight * 0.1;
var scontainerH = window.innerHeight * 0.7;
var scatterW = rightContW * 0.95 - margin.left
var scatterH = scontainerH * 0.75 - margin.top - margin.bottom
var mapW = window.innerWidth * 0.4 - margin.right;
var mapH = window.innerHeight * 0.8;
var pcpW = window.innerWidth * 0.8;
var pcpH = window.innerHeight * 0.4;

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
var drawCountries = [];
var points, x, y, xAxis, yAxis;
var xValues = [];
var yValues = [];

//Everything about colors <3
var rangeColor = [
    ['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#e6550d', '#a63603'], //laranja
    ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c'], //azul 
    ['#edf8e9', '#c7e9c0', '#a1d99b', '#74c476', '#31a354', '#006d2c'], //verde
    ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15'], //vermelho
    ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f']   //roxo
];
var numRangeColor = 0;
var color = d3.scaleLinear()
    .clamp(true)
    .domain([0, 0.2, 0.4, 0.6, 0.8, 1])
    .range(rangeColor[numRangeColor])
    .interpolate(d3.interpolateHcl);