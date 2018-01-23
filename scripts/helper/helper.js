/*boilerplate code taken from - 
https://stackoverflow.com/questions/1484506/random-color-generator*/
var Color = {
	getRandomColor: function() {
			var letters = '0123456789ABCDEF';
			var color = '#';
			for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
	}
};

// intercept functions taken from - https://github.com/jakesgordon/javascript-breakout/blob/master/game.js
var Game = {
	Math: {
		add: function(a, b){
			return a + b;
		},
		
		magnitude: function(x, y) {
  			return Math.sqrt(x*x + y*y);
		},

		intercept: function(x1, y1, x2, y2, x3, y3, x4, y4, d) {
	    	var denom = ((y4-y3) * (x2-x1)) - ((x4-x3) * (y2-y1));
	      	if (denom != 0) {
	        	var ua = (((x4-x3) * (y1-y3)) - ((y4-y3) * (x1-x3))) / denom;
		        if ((ua >= 0) && (ua <= 1)) {
		          	var ub = (((x2-x1) * (y1-y3)) - ((y2-y1) * (x1-x3))) / denom;
		          	if ((ub >= 0) && (ub <= 1)) {
		            	var x = x1 + (ua * (x2-x1));
		            	var y = y1 + (ua * (y2-y1));
		            	return {x: x, y: y, d: d};
		          	}
		        }
	      	}
	      	return null;
	 	},

	    ballIntercept: function(ball, rect) {
	      	var pt;
	      	if(ball.speed.x < 0) {
	        	pt = Game.Math.intercept(ball.x, ball.y, ball.x + ball.speed.x, ball.y + ball.speed.y, 
	                                rect.right  + ball.radius, 
	                                rect.top    - ball.radius, 
	                                rect.right  + ball.radius, 
	                                rect.bottom + ball.radius, 
	                                "right");
	      	}
	      	else if(ball.speed.x > 0) {
	        	pt = Game.Math.intercept(ball.x, ball.y, ball.x + ball.speed.x, ball.y + ball.speed.y, 
	                                rect.left   - ball.radius, 
	                                rect.top    - ball.radius, 
	                                rect.left   - ball.radius, 
	                                rect.bottom + ball.radius,
	                                "left");
	      	}
	      	if(!pt) {
	        	if(ball.speed.y < 0) {
	          		pt = Game.Math.intercept(ball.x, ball.y, ball.x + ball.speed.x, ball.y + ball.speed.y, 
	        	                       	rect.left   - ball.radius, 
	                                   	rect.bottom + ball.radius, 
	                                  	rect.right  + ball.radius, 
	                                   	rect.bottom + ball.radius,
	                                   	"bottom");
	        	}
		        else if(ball.speed.y > 0) {
		          	pt = Game.Math.intercept(ball.x, ball.y, ball.x + ball.speed.x, ball.y + ball.speed.y, 
	                                   	rect.left   - ball.radius, 
	                                   	rect.top    - ball.radius, 
	                                   	rect.right  + ball.radius, 
	                                   	rect.top    - ball.radius,
	                                   	"top");
		        }
	    	}
	      	return pt;
	    }
  	}
};
