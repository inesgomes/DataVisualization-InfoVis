//SIZES 
var margin = { top: 20, right: 20, bottom: 30, left: 40 };
var width =  window.innerWidth - margin.left - margin.right;
var height = window.innerHeight - margin.top - margin.bottom;

var sliderW = scatterW = window.innerWidth*0.6 - margin.right; //need to have some margin between 
var mapW = window.innerWidth*0.4;
var sliderH = window.innerHeight*0.2;
var scatterH = window.innerHeight*0.6;

var mapH = window.innerHeight*0.8;
var pcpW = window.innerWidth*0.8;
var pcpH = window.innerHeight*0.4;

//JSONS
var assaults = assault.countries;
var burglaries = burglary.countries;
var homicides = homicide.countries;
var robberies = robbery.countries;
var sexviolences = sexualviolence.countries;

//OTHERS
var drawCountries=[];