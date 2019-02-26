import './less/main.less';
import WisconsinMap from './data/wisconsin.json';
import USA from './data/states.json';

var d3 = require("d3");

var width = window.innerWidth;
var height = window.innerHeight;

var mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

addEventListener("mousemove", function(event){
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

function distance(x1,y1,x2,y2){
    var xDist = x2 - x1;
    var yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

var projection = d3.geoAlbers()
    .translate([width / 2, height / 2])
    .scale(1000)
    .center([0, 45]);

var canvas = d3.select('body')
    .append('canvas')
    .attr("width", width)
    .attr("height", height);

var ctx = canvas.node().getContext('2d');

var path = d3.geoPath()
    .projection(projection)
    .context(ctx);

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

var states = USA.features;

function mapFeature(feature){
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
            ctx.fillStyle = 'red';
            ctx.fill();
        }
    }
}

var features = []
function init(){
    states.forEach(function(feature){
       features.push(new mapFeature(feature));
    });
}

function animate(){
    requestAnimationFrame(animate);

    ctx.clearRect(0,0, canvas.width, canvas.height);

    fix_dpi();

    for(var i = 0; i < features.length; i++){
        features[i].update();
    }
}

init();
animate();
