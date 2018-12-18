//SIZES 
var margin = { top: 30, right: 20, bottom: 30, left: 20 };
var width = window.innerWidth - margin.left - margin.right;
var height = window.innerHeight - margin.top - margin.bottom;

var panelH = window.innerHeight * 0.65
var mapH = window.innerHeight * 0.7 - margin.top    
var scatterH = panelH * 0.5
var pcpH = window.innerHeight * 0.4;
var sliderH = window.innerHeight * 0.1;

var textW = window.innerWidth * 0.2;
var leftContW = window.innerWidth * 0.4; //need to have some margin between 
var scatterW = leftContW * 0.85;
var mapW = window.innerWidth * 0.4;
var pcpW = window.innerWidth * 0.8;

//JSONS
var assaults = assault.countries;
var burglaries = burglary.countries;
var homicides = homicide.countries;
var robberies = robbery.countries;
var sexviolences = sexualviolence.countries;

//INIT values
var defaultB = "assault";
var defaultY = "sexualviolence";
var defaultYear = 2010;
var drawCountries = [];

//legend sizes
var ls_w = 15, ls_h = 15;

//OTHER variables
var points, x, y, xAxis, yAxis;
var xValues = [];
var yValues = [];

//Everything about colors <3
var selectedColor = 'black';
var noDataColor = 'gray';

var rangeColor = [
    [noDataColor ,'#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#e6550d', '#a63603'], //laranja
    [noDataColor ,'#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c'], //azul 
    [noDataColor ,'#edf8e9', '#c7e9c0', '#a1d99b', '#74c476', '#31a354', '#006d2c'], //verde
    [noDataColor ,'#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15'], //vermelho
    [noDataColor ,'#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f']   //roxo
];
var numRangeColor = 0;
var color = d3.scaleLinear()
    .clamp(true)
    .domain([-1, 0, 0.2, 0.4, 0.6, 0.8, 1])
    .range(rangeColor[numRangeColor])
    .interpolate(d3.interpolateHcl);

