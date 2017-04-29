
var objects = (function(speed, blockSize, beginpuffer, base, origin, gravity, score, walls, renderList){

	// Ground block object
	function Block(id, x, y, v, h) {
		this.x = x;
		this.y = y;

		this.nt = 4;
		if(id == false)
			this.id = 0;
		else
			this.id = id;
		this.prev = undefined;
		this.wall = true;
		this.width = v;
		this.height = h;

		if(this.id > beginpuffer) {
			var spaceing = score/1000000 * (11-7) + 7;  // spacing between walls
			var probability = score/1000000 * (1-0.3) + 0.3;  // from 0 to 1

			var a = walls.length > 0 ? this.id - walls[walls.length-1].id > spaceing : false;   // during + b
			var b = Math.random() < probability;    // during + a
			var c = this.id < beginpuffer + 1;      // from start
			var d = walls.length > 0 ? this.id - walls[walls.length-1].id > 20 : false;
			var e = walls.length == 0;              // from start | first wall

			if( a && b || c || d || e) {
	            // var rank; // Max score guess
			    // while(rank > score || rank == undefined) { // try to find object that has an id lower or equal to the curent score
	            //
	            //     rank = part.rank;
			    // }
				var part = parts[Math.floor(random(parts.length))];
				var tempWall = new Wall(this.id, this.x, this.y, part.data);
				walls.push(tempWall);
			}

		}
	}

	    Block.prototype.show = function() {
			fill(255);
			if(this.id == 0)
				stroke(0);
			else
				stroke(255);
	        rect(this.x - origin.x, this.y, this.width, this.height);
	    }

	    Block.prototype.overlap = function(player) {
			let x = player.location.x + (player.size/2) > this.x && player.location.x - (player.size/2) < this.x + this.width;
			let y = player.location.y - (player.size/2) < this.y && player.location.y + (player.size/2) > this.y + this.height;
			if ( x )
				if( y )
					return true;
			else
				return false;
	    }

	// Wall object
	function Wall(id, x, y, data) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.wallBlocks = [];
		for( i in data )
			for( j in data[i] )
				if(data[i][j] == 1)
					this.wallBlocks.push(new Block(false, (this.x + blockSize*j), this.y - blockSize * 3 + blockSize * i, blockSize, -blockSize));
	}

	    Wall.prototype.show = function() {
			for( i in this.wallBlocks )
				this.wallBlocks[i].show();
	    }

	// Player Object
	function Player(x, y, v) {

		this.location = new createVector(x, y);
		this.velocity = new createVector(0, 0);
		this.acceleration = new createVector(0, 0);

		this.speed = speed;
		this.force = new createVector(this.speed, 0);

		this.color = 255;
		this.size = v*2;

		this.maxvel = 10;
		this.airborn = false;

		this.clicked = 0;

	}

		Player.prototype.isAirborn = function() {
			return this.airborn;
		}

		Player.prototype.setAirborn = function(val) {
			this.airborn = val;
		}

		// check if player is on the ground and colide with it
		Player.prototype.ground = function() {
			if (this.location.y > base - this.size/2) {
				this.setAirborn(false);
				this.clicked = 0;
				this.location.y = base - this.size/2;
			}
		}

		Player.prototype.update = function() {

			this.location.add(this.velocity);
			this.velocity.add(this.acceleration);

			var vely = this.velocity.y < this.maxvel ? gravity : 0;
			this.velocity.y += vely * 0.1;
			this.velocity.x = this.force.x * 0.1;

			this.force.mult(0);

			this.location.x += this.speed;

			this.ground();
		};

		Player.prototype.show = function() {
			this.update();
			fill(0);
			stroke(this.color);
			ellipse(this.location.x - origin.x, this.location.y, this.size);
		}

		Player.prototype.jump = function() {
			if(!this.isAirborn() || this.clicked < 2) {
				this.velocity.y = -12;
				this.clicked++;
				this.setAirborn(true);
			}
		};

	return {
		Block: Block,
		Player: Player,
		Wall: Wall
	};

});
