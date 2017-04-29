

// save a value to Android
// or localstorage on the browser
function setSaveValue(key, value) {
    try {
        Android.setKeyValue(key, value);
    } catch(err) {
        if(localStorage) {
            localStorage.setItem(key, value);
        } else {
            console.error("Highscore not saved!");
        }
    }
}

// get the saved value from setSaveValue();
function getSaveValue(key, callback) {
    try {
        var value = Android.getKeyValue(key);
        callback(value);
    } catch(err) {
        if(localStorage) {
            var val = localStorage.getItem(key);
            callback(val);
        } else {
            console.error("No save, or not able to save to storage!");
        }
    }
}

window.onload = function() {


    game = new _Renderer({
		width: window.innerWidth,
		height: window.innerHeight,
		class:"canvas",
		bgColor: "#000",
		vp: $("canvas") [0]
	});

};

var Uncut = (function(){

    // load screens in the dom
    var domCach = $(".main");

    var startScreen = domCach.find(".startScreen")[0];
    var deadScreen = domCach.find(".deadScreen")[0];
    var unlocksScreen = domCach.find(".unlocksScreen")[0];
    var unlockslist = domCach.find(".unlocksScreen .unlockslist")[0];

    var gridHeight = 50;
    var speed = 3;
    var gravity = 9.81;
    var beginpuffer; // in blocks

    // engiene
    var player, blockSize, base, origin, path = [], walls = [], renderList = [], W, H;

    // playtime
    var starttime,
        playtime = 0;

    var highscore = 0,
        score = 0,
        crashes = 0;

    var running = false;
    var obj;

    function bindEvents(event) {
        domCach.find(".playBtn")[0].addEventListener(event, play);
        domCach.find(".playBtn")[0].addEventListener(event, play);
        domCach.find(".unlocksBtn")[0].addEventListener(event, function() {
            startScreen.dataset.display = false;
            unlocksScreen.dataset.display = true;
            unlocks.update();
        });
        domCach.find(".retry.Btn")[0].addEventListener(event, play);
        domCach.find(".back.Btn")[0].addEventListener(event, back);
        domCach.find(".back.Btn")[1].addEventListener(event, back);
    }

    // back to the startscreen
    function back() {
        domCach.find(".startScreen .highscore")[0].innerHTML = Uncut.getHighscore();
        domCach.find(".startScreen .crashes")[0].innerHTML = Uncut.getCrashes();
        startScreen.dataset.display = true;
        unlocksScreen.dataset.display = false;
        deadScreen.dataset.display = false;
    }

    function initUnlocks() {
        unlocks.createUnlock("Get a highscore of 1000", 1000, Uncut.getHighscore);
        unlocks.createUnlock("Get a highscore of 5000", 5000, Uncut.getHighscore);
        unlocks.createUnlock("Get a highscore of 10000", 10000, Uncut.getHighscore);
        unlocks.createUnlock("Get a highscore of 50000", 50000, Uncut.getHighscore);
        unlocks.createUnlock("Get a highscore of 100000", 100000, Uncut.getHighscore);
    }

    function init() {

        W = window.innerWidth;
        H = window.innerHeight;

        if(screen.width > 720) {
            W = 600;
            bindEvents("click");
            document.addEventListener("mousedown", function() {
                if(running) {
                    player.jump();
                }
            }, false);
        } else {
            bindEvents("touchstart");
            document.addEventListener("touchstart", function() {
                if(running) {
                    player.jump();
                }
            }, false);
        }

        getSaveValue("_highscore", function(hscore) {
            if(hscore) {
                highscore = hscore;
            }
        });

        getSaveValue("_crashes", function(val) {
            if(val) {
                crashes = val;
            }
        });

        createCanvas(W, H);

        $(".startScreen .highscore")[0].innerHTML = Uncut.getHighscore();
        $(".startScreen .crashes")[0].innerHTML = Uncut.getCrashes();

    }

    function play() {

        base = (H/2);
        blockSize = Math.floor(H/gridHeight);
        beginpuffer = width/blockSize;

    	path = [];
    	walls = [];
    	renderList = [];
        score = 0;

    	origin = {
    		x: 0,
    		y: 0
    	}

        obj = objects(speed, blockSize, beginpuffer, base, origin, gravity, score, walls, renderList);

    	player = new obj.Player(blockSize*10, base, blockSize/2, speed);

    	renderList.push(new obj.Block(0, 0, base, blockSize, blockSize));

    	deadScreen.dataset.display = false;
    	startScreen.dataset.display = false;
    	unlocksScreen.dataset.display = false;

        game.run();
        running = true;

    	console.log("Running.");
    }

    function render(ctx) {

        if(running) {

        	for( var i = renderList.length; i--; ) {
        	    if( renderList[i].x < origin.x - blockSize ) {
        	        renderList.splice( renderList[renderList.indexOf(renderList[i])], 1 );
        	    } else {
        	        renderList[i].show();
        	    }
        	}

        	for( var i = walls.length; i--; ) {
                walls[i].show();
        	}

            // gen new blocks and walls
            // and show them
        	if( renderList.length < (width / blockSize) + 1 ) {
        	    var i = renderList[renderList.length -1];
        		var newTemp = new obj.Block(i.id + 1, i.x + blockSize, base, blockSize, blockSize);
        		newTemp.prev = i;
        		renderList.push(newTemp);
        	}

            // draw player
            player.show();

        	// move to the right
        	origin.x += speed;

            // draw walls and check collision
        	for( i in walls ) {
                var wall = walls[i];
                if(wall.x < player.location.x + (player.size/2)) {
                    for( b in wall.wallBlocks ) {
                        if(wall.wallBlocks[b].overlap(player)) {
                			onDead(score);
                			return true;
                		} else {
                			score += 1;
                		}
                    }
                }
        	}

            fill(255);
            textSize(50);
            textStyle(BOLD);
            textAlign(RIGHT);
            textFont("sans-serif");
            text(score.toString(), W - W/80, base + 60);
            textSize(20);
            text(highscore.toString(), W - W/80, base + 60 + 20);

        }
    }

    function isRunning() {
        return game.isRunning();
    }

    function getHighscore() {
        return highscore;
    }

    function getCrashes() {
        return crashes;
    }

    function getPlaytime() {
        return Math.floor(playtime) + " Minutes";
    }

    function getCurentTime() {
        var date = new Date();
        return date.getTime();
    }

    function updatePlaytime(starttime) {
        var tempPt = ((getCurentTime() - starttime)/1000)/60;
        playtime = parseFloat(playtime) + parseFloat(tempPt);
        return playtime;
    }

    // gets called when player dies
    function onDead(score) {
        game.pause();
        crashes++;
        if(highscore < score) {
    		highscore = score;
    	}
        setSaveValue("_crashes", crashes);
        setSaveValue("_highscore", highscore);
    	deadScreen.dataset.display = true;
    	$(".score")[0].innerText = score;
    	$(".highscore")[0].innerText = highscore;
    }

    return {
        getHighscore: getHighscore,
        getCrashes: getCrashes,
        render: render,
        init: init,
        isRunning: isRunning,
        play: play
    };

})();

function setup() { Uncut.init(); }

function random(z) {
	return Math.floor((Math.random() * z) + 1);
}
