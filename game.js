/*boilerplate code taken from - 
https://stackoverflow.com/questions/1484506/random-color-generator*/
function getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
}

/*var gameOver = false;*/

/*event listeners*/
addEventListener("keydown", function(event){
	if(event.keyCode == 37){
		left = true;
	}
	if(event.keyCode == 39){
		right = true;
	}
	// console.log(event.keyCode);
});

addEventListener("keyup", function(event){
	if(event.keyCode == 37){
		left = false;
	}
	if(event.keyCode == 39){
		right = false;
	}
});

addEventListener("keydown", function(event){
	if(event.keyCode == 13){
		restart();
	}
	// console.log(event.keyCode);
});

var canvas = document.querySelector("canvas");
var cx = canvas.getContext("2d");

/*ball class*/
function Ball(x, y){
	this.x = x;
	this.y = y;
}

Ball.prototype.setRadius = function(radius){
	this.radius = radius;
}
Ball.prototype.setSpeed = function(speed_x, speed_y){
	this.speed = {x: speed_x, y: speed_y};
}
Ball.prototype.setColor = function(color){
	this.color = color;
} 

ball = new Ball(canvas.width/2, 3*canvas.height/4);
ball.setRadius(10);
ball.setSpeed(6, 6);
ball.setColor("yellow");

function drawBall(){
	cx.beginPath();
	cx.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI);
	cx.fillStyle = ball.color;
	cx.fill();
	cx.closePath();
}

function moveBall(){
	if(ball.x >= (canvas.width-ball.radius)){
		// right wall
		ball.speed.x *= -1;
	}
	if(ball.x <= ball.radius){
		// left wall
		ball.speed.x *= -1;
	}
	if(ball.y <= ball.radius){
		// upper wall
		ball.speed.y *= -1;

		/*???*/
		ball.y = ball.radius;
	}
	if(ball.y >= (canvas.height-ball.radius-sprite.height)){
		// lower wall
		if((ball.x >= (sprite.x - sprite.width/2)) && (ball.x <= (sprite.x + sprite.width/2)))
			ball.speed.y *= -1;
		else{
			restart();
			// ball.speed = {x:0, y:0};
		}
			
	}
	ball.x += ball.speed.x;
	ball.y -= ball.speed.y;
}

/*sprite class*/
function Sprite(width, height, x, y){ 
	this.height = height;
	this.width = width;
	this.x = x;
	this.y = y;
	this.onScreen = true;
}

Sprite.prototype.setSpeed = function(speed_x, speed_y){
	this.speed = {x: speed_x, y: speed_y};
}

Sprite.prototype.setColor = function(color){
	this.color = color;
}

sprite = new Sprite(100, 10, canvas.width/2, canvas.height-15/2);
sprite.setSpeed(6, 2);

function drawSprite(){
	cx.beginPath();
	cx.rect(sprite.x - sprite.width/2, sprite.y - sprite.height/2, sprite.width, sprite.height);
	cx.fill();
	cx.closePath();
}

var right = false;
var left = false; 

function moveSprite(){
	if(right && (sprite.x + sprite.width/2) < canvas.width){
		sprite.x += sprite.speed.x;
	}
	if(left && (sprite.x > sprite.width/2)){
		sprite.x -= sprite.speed.x;
	}
}

function play(){
	cx.clearRect(0, 0, canvas.width, canvas.height);

	// draw
	drawBall();
	drawSprite();
	drawBars();

	// move
	moveBall();
	moveSprite();

	// detect
	detectCollision();
	console.log(ball.speed);
}

var timer;

function autoPlay(){
	timer = setInterval(play, 10);
}

function restart(){
	clearInterval(timer);
	
	/* reinitialize ball*/
	ball.x = canvas.width/2;
	ball.y = 3*canvas.height/4;
	ball.setSpeed(6, 6);

	/*reinitialize sprite*/
	sprite.x = canvas.width/2; 
	sprite.y = canvas.height-sprite.height/2;
	autoPlay();
}
autoPlay();

/*var verticalDist = 10;
var horizontalDist = 10;*/

function initializeBars(horizontalNum, verticalNum){
	/*array of sprite objects*/
	var allBars = Array();

	var width = canvas.width / horizontalNum;
	var height = (canvas.height/4) / verticalNum;
	
	/*outer loop -> y, inner loop -> x*/
	for(var y=0; y<verticalNum; y+=1){
		for(var x=0; x<horizontalNum; x+=1){
			s = new Sprite(width, height, x*width, y*height);
			s.setColor(getRandomColor());
			allBars.push(s);
		}
	}

	return allBars;
}

var allBars = initializeBars(15, 7);

function drawBars(){
	allBars.forEach(function(bar){
		if(bar.onScreen){
			cx.beginPath();
			cx.rect(bar.x, bar.y, bar.width, bar.height);
			cx.fillStyle = bar.color;
			cx.fill();
			cx.closePath();
		}
	});
}

function detectCollision(){
	for(var i=0; i<allBars.length; i++){
		var a = ball.x >= allBars[i].x;
		var b = ball.y >= allBars[i].y;
		var c = ball.x <= allBars[i].x + allBars[i].width;
		var d = ball.y <= allBars[i].y + allBars[i].height;

		if(a && b && c && d && allBars[i].onScreen){
			// reflection
			ball.speed.y *= -1;

			allBars[i].onScreen = false;
		}
	}
}