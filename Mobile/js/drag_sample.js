var canvas;
var ctx;
var x = 75;
var y = 50;
var dx = 5;
var dy = 3;
var WIDTH = 400;
var HEIGHT = 300;
var dragok = false,
    text = "Hey there im movin!",
    textLength = (text.length * 14)/2;

function rect(x,y,w,h) {
 ctx.font = "14px Arial";
 ctx.fillText("Hey there im a movin!!", x, y);
}

function clear() {
 ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function init() {
 canvas = document.getElementById("canvas");
 ctx = canvas.getContext("2d");
 return setInterval(draw, 10);
}

function draw() {
 clear();
 ctx.fillStyle = "#FAF7F8";
 ctx.fillStyle = "#444444";
 rect(x - 15, y + 15, textLength, 30);
}

function myMove(e){
 if (dragok){
  x = e.pageX - canvas.offsetLeft;
  y = e.pageY - canvas.offsetTop;
 }
}

function myDown(e){
 if (e.pageX < x + textLength + canvas.offsetLeft && e.pageX > x - textLength + canvas.offsetLeft && e.pageY < y + 15 + canvas.offsetTop &&
 e.pageY > y -15 + canvas.offsetTop){
  x = e.pageX - canvas.offsetLeft;
  y = e.pageY - canvas.offsetTop;
  dragok = true;
  canvas.onmousemove = myMove;
 }
}

function myUp(){
 dragok = false;
 canvas.onmousemove = null;
}

init();
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;