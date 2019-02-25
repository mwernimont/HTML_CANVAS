import './less/main.less';

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

var canvas = d3.select('body')
    .append('canvas')
    .attr("width", width)
    .attr("height", height);

var ctx = canvas.node().getContext('2d');

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

var data = [
    {
        x: 250,
        y: height / 2,
        radius: 10,
        text: 'I am a Blue circle',
        color: '#0000ff'
    },
    {
        x: 500,
        y: height / 2,
        radius: 20,
        text: 'I am a Red circle',
        color: '#ff0000'
    },
    {
        x: 750,
        y: height / 2,
        radius: 35,
        text: 'I am a Green circle',
        color: '#00ff00'
    }
]

function Circle(x,y,radius,color,text){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.text = text;

    this.update = function(){
        this.draw();

        if(distance(mouse.x, mouse.y, this.x, this.y) < this.radius){
            ctx.fillStyle = '#000000';
            ctx.font = "16px Arial";
            ctx.fillText(this.text, mouse.x + 10, mouse.y + 5);
        }
    }

    this.draw = function(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        ctx.closePath();
    };
}

var circles = [];
function init(){
    data.forEach(function(d){
        circles.push(new Circle(d.x, d.y, d.radius, d.color, d.text));
    });     
}

function animate(){
    requestAnimationFrame(animate);

    ctx.clearRect(0,0, canvas.width, canvas.height);

    fix_dpi();

    for(var i = 0; i < circles.length; i++){
        circles[i].update();
    }
    
}

init();
animate();