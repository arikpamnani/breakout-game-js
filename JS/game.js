var canvas = document.querySelector("canvas");
var cx = canvas.getContext("2d");

var app = {lives: 3, score: 0, paused: false, gameOver: false, off: true};

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
ball.setRadius(7);
ball.setSpeed(6, -6);
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
			/* :( */
			app.lives -= 1;
			if(app.lives <= 0){
				app.gameOver = true;
				app.off = true;
				restart(true);
			}
			else
				restart();
		}
	}
	ball.x += ball.speed.x;
	ball.y += ball.speed.y;
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

	// detect
	// detectCollision();
	updateCollision(null);

	// move
	moveBall();
	moveSprite();

	// score & lives
	dispScore();
	dispLives();
}

var timer;

function autoPlay(){
	timer = setInterval(play, 12);
}

function restart(wait = false){
	clearInterval(timer);

	/*reinitialize ball*/
	ball.x = canvas.width/2;
	ball.y = 3*canvas.height/4;

	/*reinitialize sprite*/
	sprite.x = canvas.width/2; 
	sprite.y = canvas.height-sprite.height/2;

	if(app.gameOver){
		/*reinitialize app*/
		app.lives = 3;
		app.score = 0;
		app.paused = false;
		app.gameOver = false;

		/*reinitialize bars*/
		allBars.forEach(function(bars){
			bars.onScreen = true;
		});
	}

	// go to initial state
	if(wait)
		ball.setSpeed(0, 0);
	else
		ball.setSpeed(6, -6);

	autoPlay();
}

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
			s.setColor(Color.getRandomColor());
			allBars.push(s);
		}
	}

	return allBars;
}

var allBars = initializeBars(17, 6);

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

			// increase score
			app.score += 1;
			allBars[i].onScreen = false;
		}
	}
}

function updateCollision(dt){
	var distCurrent, distClosest = Infinity, point, closest = null;

	allBars.forEach(function(bar){
		if(bar.onScreen){
			// dummy object 
			var item = {left: bar.x, right: bar.x + bar.width, top: bar.y, bottom: bar.y + bar.height};
			
			point = Game.Math.ballIntercept(ball, item);
			if(point){
				distCurrent = Game.Math.magnitude(point.x - ball.x, point.y = ball.y)

				// check for minimum
				if(distCurrent < distClosest){
					distClosest = distCurrent;
					closest = {bar: bar, point: point}
				}
			}
		}
	});

	if(closest){
		// updating score
		app.score += 1;
		
		closest.bar.onScreen = false;

		/*ball.x = closest.point.x, ball.y = closest.point.y;*/

		switch(closest.point.d){
			case 'left':
			case 'right':
				ball.speed.x *= -1;
				break;
			case 'bottom':
			case 'top':
				ball.speed.y *= -1;
				break;
		}

		// recurse for remaining time
		/*var udt = dt * (distClosest/Game.Math.magnitude(ball.speed.x, ball.speed.y));
		updateCollision(udt);*/
	}
}

var start_button = document.querySelector("button.start");
console.log(start_button);
start_button.onclick = function(){
	if(app.off){
		app.off = false;
		restart();
	}
}

var currSpeed = {x: 0, y: 0};
var pause_button = document.querySelector("button.pause");
pause_button.onclick = function(){
	if(app.paused){
		ball.speed = currSpeed;
		app.paused = false;

		// change button symbol 
		pause_button.innerHTML = "&#9646; &#9646;";
	}
	else{
		currSpeed = ball.speed;
		ball.speed = {x: 0, y: 0};
		app.paused = true;

		// change button symbol
		pause_button.innerHTML = "&#9658";
	}
}

var restart_button = document.querySelector("button.restart");
restart_button.onclick = function(){
	app.gameOver = true;
	restart();
}

function dispScore(){
	document.querySelector("input.score").value = app.score;
}

function dispLives(){
	document.querySelector("input.lives").value = app.lives;
}

// initialize
play();

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

