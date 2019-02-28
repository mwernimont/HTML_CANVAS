import './style.less';
import NHL from './data/data.json';
import usMap from './data/us_state.json';
import canada from './data/CAN_1.json';

var d3 = require('d3');

var height = window.innerHeight,
    width = window.innerWidth;

var canvas = d3.select('body')
    .append('canvas')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'map');

var ctx = canvas.node().getContext('2d');

var projection = d3.geoAlbers()
    .translate([width/2, height/2])
    .scale(1000)
    .center([0, 45]);

var path = d3.geoPath()
    .projection(projection)
    .context(ctx);

var provinces = canada.features;
var states = usMap.features;
var locations = NHL.teams;
var circle = d3.geoCircle();

var mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

//Kep track of where the mouse is
addEventListener("mousemove", function(event){
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

var dpi = window.devicePixelRatio;
//Fixes Fuzzy Canvas Elements Issue
function fix_dpi(){
    var style = {
        height(){
            return +getComputedStyle(canvas.node()).getPropertyValue('height').slice(0, -2);
        },
        width(){
            return +getComputedStyle(canvas.node()).getPropertyValue('width').slice(0,-2);
        }
    }
    //set the correct attributes for a crystal clear image!
    canvas.node().setAttribute('width', style.width() * dpi);
    canvas.node().setAttribute('height', style.height() * dpi);
}

//Draw Map
function Map(feature){
    this.feature = feature;

    this.update = function(){
        this.draw();
    }

    this.draw = function(){
        ctx.beginPath();
        path(this.feature);
        ctx.fillStyle = 'gray';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        if(ctx.isPointInPath(mouse.x, mouse.y)){
            ctx.fillStyle = 'rgb(190,190,190)';
            ctx.fill();
        }
    }
}
//Draw Cities
function Cities(x,y,radius,color,teamName){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.teamName = teamName;

    this.updateCity = function(){
        this.drawCity();

        if(ctx.isPointInPath(mouse.x, mouse.y)){
            ctx.beginPath();
            ctx.font = "16px Arial";
            //Box BBG Color
            ctx.fillStyle = 'rgb(220,220,220)';
            var textWidth = ctx.measureText(this.teamName).width;
            ctx.fillRect(mouse.x + 10, mouse.y + 5, textWidth + 10, 20);
            ctx.fill();
            //Text Color
            ctx.fillStyle = '#000000';
            ctx.fillText(this.teamName, mouse.x + 15, mouse.y + 20);
            ctx.fill();
            ctx.closePath();
        }
    }

    this.drawCity = function(){
        ctx.beginPath();
        path(circle.center([this.x, this.y]).radius(this.radius)());
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

var features = [];
var cities = [];
function init(){
    //cycle through the provinces feature and add to the feature array
    provinces.forEach(function(province){
        features.push(new Map(province));
    });
    //cycle through the states feature and add to the feature array
    states.forEach(function(state){
        features.push(new Map(state));
    });

    locations.forEach(function(location){
        cities.push(new Cities(location.lon, location.lat, .4, location.color, location.name));
    });
}

function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    fix_dpi();

    //Cycle through the feature array and run the features through the update function
    //Draws the Features on the Canvas
    for(var i = 0; i < features.length; i++){
        features[i].update();
    }

    for(var i = 0; i < cities.length; i++){
        cities[i].updateCity();
    }
}

init();
animate();
















 
