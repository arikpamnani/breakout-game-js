var canvas = document.querySelector("canvas");

var env = {
	// res -> resolution
	get_xyz: function(res){
		var xyz = new Array(ball.x, ball.y, sprite.x);
		for(var i=0; i<xyz.length; i++){
			xyz[i]=Math.floor(xyz[i]/res);
		}

		// return grid number 
		return xyz;
	}
};	

// Simple Q learning algorithm
var QAgent = function(){
	// Q, actions, gamma, alpha
	this.Q = null; 
	this.actions = new Array(-1, 0, 1);
	this.gamma = 0.98;
	this.alpha = 0;

	// previous state, action
	this.p_state = null;
	this.p_action = null;

	// current state, action
	this.c_state = null;
	this.c_action = null;

	// current reward
	this.c_reward = null;
};

QAgent.prototype = {
	init: function(){
		this.resolution = 15;
		this.h = canvas.height/this.resolution;
		this.w = canvas.width/this.resolution;
		this.num_states = this.h * this.w;
		
		// initialize Q -> 3-d matrix 
		// Q[ball_position][sprite_position][action]
		this.Q = math.zeros(this.num_states, this.w, this.actions.length);
	},

	getReward: function(){

	},

	chooseAction: function(){
		// choose appropriate action
		var choice = this.Q._data[this.c_state[0]][this.c_state[1]];
		var max = choice.reduce(function(a, b){
			return Math.max(a, b);
		});

		// argmax
		var argmax = new Array();
		for(var i=0; i<choice.length; i++){
			if(choice[i]==max)
				// -1, 0, 1 actions
				argmax.push(i-1);	
		}

		// update current action
		this.c_action = argmax[Math.floor(Math.random() * argmax.length)];
	},

	updateQ: function(){
		var xyz = env.get_xyz(this.resolution);

		// update current state, action
		this.c_state = new Array(this.w*xyz[1]+xyz[0], xyz[2]);
		this.chooseAction();

		// reward
		var reward = this.getReward(); 

		// update Q values
		if(this.p_state != null){
			// max(Q[s', a'])
			var p_max = this.Q._data[this.c_state[0]][this.c_state[1]].reduce(function(a, b){
				return Math.max(a, b);
			});

			// Q[s, a]
			var val = this.Q._data[this.p_state[0]][this.p_state[1]];

			// update
			var update = this.alpha * (reward + this.gamma * (p_max) - val);  
			this.Q._data[this.p_state[0]][this.p_state[1]] += update;

			// update previous state, action
			this.p_state = this.c_state;
			this.p_action = this.c_action;
		}
	}
};

var qagent = new QAgent();
qagent.init();
qagent.updateQ();
