var game;

window.onload = function() {
    game = new Main();
};

class Main {

    constructor() {
        this.width = 0;
        this.height = 0;

        this.ground = [];

        this.highscore = 0;
        this.crashes = 0;

        this.playerSkin = Assets.skins[0];

        this.init();
    }

    init() {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.blockSize = 18;

        if(screen.width > 720) {
            this.width = 600;
        }

        this.Menu = new _Menu(this);
        this.Unlocks = new _Unlocks(this);
        this.Input = new _Input(this);

        this.initScene();

        //Unlock
        //this.Unlocks.createUnlock({
        //    title: "Get a highscore of 5000",
        //    target: 5000,
        //    f() { this.setCurrentSkin(Assets.skins[1]) },
        //    desc: "Animation!",
        //    aim: this.getHighscore.bind(this)
        //});

    }

    initScene() {

        this.score = 0;
        this.camera = new _Camera(-this.width/2, 0);
        this.Renderer = new _Renderer(this, {
            camera: this.camera,
            settings: {
                width: this.width,
                height: this.height,
                class: "canvas",
                bgColor: "#000"
            }
        });

        this.Renderer.addRenderGroup("player");
        this.Renderer.addRenderGroup("ground");
        this.Renderer.addRenderGroup("walls");

        this.player = new Player({
            x: this.width/3,
            y: 0,
            r: this.blockSize/2,
            w: this.blockSize,
            h: this.blockSize,
            rigid: true,
            collider: true
        }).sprite(this.getCurentSkin());
        this.Renderer.addToRenderGroup("player", this.player);
    }

    run() {
        // game logic
        console.log("Running.");
        this.Renderer.run();
    }

    pause() {
        console.log("Paused.");
        this.Renderer.pause();
    }

    resume() {
        console.log("Resuming.");
        this.Renderer.resume();
    }

    reset() {
        this.ground = [];
        this.Renderer.renderGroups = [];
        this.initScene();
        this.run();
    }

    onRender() {

        let bs = this.blockSize;
        let w = this.width / bs;

        for( let i = this.ground.length; i--; ) {
    	    if( -this.ground[i].location.x < this.camera.location.x ) {
    	        this.ground.splice( this.ground[this.ground.indexOf(this.ground[i])], 1 );
    	    }
    	}

        let rge = this.Renderer.getRenderGroup("walls").elements;
    	for( let i in rge ) {
    	    if(-rge[i].location.x - this.width/2 > this.camera.location.x) {
                rge.splice(i, 1);
    	    }
    	}

        if( this.ground.length < (this.width / bs) ) {
            let id = this.ground.length > 0 ? this.ground[this.ground.length-1].id++ : 0;
            let btemp = new Block(id, {
                x: bs * id,
                y: -bs/2,
                w: bs,
                h: bs
            }).rect();
            this.Renderer.addToRenderGroup("ground", btemp);
            this.ground.unshift(btemp);

            if(id > w) {

                let rg = this.Renderer.renderGroups.walls.elements;

    			var spaceing = this.score/1000000 * (11-7) + 7;  // spacing between walls
    			var probability = this.score/1000000 * (1-0.3) + 0.3;  // from 0 to 1

                let lid = rg.length > 0 ? rg[0].id : 0;
    			var a = lid < id - (spaceing);
    			var b = Math.random() < probability;

    			if( a && b || lid == 0 ) {
                    let rg = this.Renderer.getRenderGroup("walls");
                    new Structure(bs, id, rg);
    			}
    		}
    	}

        this.Renderer.drawText(this.camera, 45, this.score.toString(), this.width - this.width/80, 60);

        //this.camera.location.x -= 3;
        //this.player.location.x += 3;
    }

    onUpdate(dt) {
        // on update
        this.score += 1;
        this.camera.location.x -= 190 * dt;
        this.player.location.x += 190 * dt;
    }

    gameOver() {
        this.pause();
        this.crashes++;
        if(this.highscore < this.score) {
    		this.highscore = this.score;
    	}
        setSaveValue("_crashes", this.crashes);
        setSaveValue("_highscore", this.highscore);
        this.Menu.gameover();
    	$(".score")[0].innerText = this.score;
    	$(".highscore")[0].innerText = this.highscore;
    }

    getHighscore() {
        return this.highscore;
    }

    getCrashes() {
        return this.crashes;
    }

    getCurentSkin() {
        return this.playerSkin;
    }

    setCurrentSkin(skin) {
        this.playerSkin = skin;
    }

}

class Player extends Entity {

    constructor(a) {
        super(a);
        this.clickCounter = 0;
        this.airborn = true;
        this.jumpPower = 650;
        this.gravity = -9.81/2;

        this.history = [];
    }

    jump() {
        if(!this.airborn || this.clickCounter < 2) {
            this.velocity.y = this.jumpPower;
            this.clickCounter++;
            this.airborn = true;
        }
    }

    onCollide() {
        if (this.location.y <= 0 + this.attr.r) {
            this.airborn = false;
            this.clickCounter = 0;
            this.location.y = 0 + this.attr.r;
        }
    }

    onAnimate() {
        if(this.airborn)
            this.sprite.x = 4;
    }

    onRender() {
        this.keepHistory();
    }

    keepHistory() {
        this.history.unshift({
            r: this.attr.r,
            x: this.location.x,
            y: this.location.y,
            w: this.attr.w,
            h: this.attr.h
        });
        if(this.history.length > 4) {
            this.history.pop();
        }
    }

}

class Block extends Entity {

    constructor(b, a) {
        super(a);
        this.id = b;
    }

    onCollide() {
        //collision
        if (this.location.y <= 0 + this.attr.r) {
            this.airborn = false;
            this.clickCounter = 0;
            this.location.y = 0 + this.attr.r;
        }
    }

    onAnimate() {
        // if animated sprite
        if(this.airborn)
            this.sprite.x = 3;
    }

}

class Wall extends Entity {

    constructor(b, a) {
        super(a);
        this.id = b;
    }

    onCollide() {
        //collision
        let playerloc = game.player.location;
        if(this.location.x > playerloc.x - 100) {
            let playerr = game.player.attr.r;
            if(playerloc.x + playerr >= this.location.x - this.attr.w/2 && playerloc.x - playerr <= this.location.x + this.attr.w/2) { //x
                if( playerloc.y + playerr - 1 >= this.location.y - this.attr.h/2 && playerloc.y - playerr <= this.location.y + this.attr.h/2 ) { //y
                    game.gameOver();
                }
            }
        }
    }
}

class Structure {

    constructor(bs, id, rg) {
        this.bs = bs;       // blocksize
        this.id = id;
        this.renderGroup = rg;
        this.parts = Assets.parts;
        this.part = this.parts[Math.floor(random(this.parts.length-2))];
        this.data = this.part.data;
        this.rank = this.part.rank;

        this.Walls = [];

        // init structure
        this.build(this.data);
    }

    build(data) {
        let bs = this.bs;
        let id = this.id;

        for( let x = data.length; x--; ) {
            for( let y in data[x] ) {
                if(data[y][x] == 1) {
                    let btemp = new Wall(id, {
                        x: (id + x) * bs,
                        y: (bs * -y) + bs*3.5,
                        w: bs,
                        h: bs,
                        collider: true
                    }).rect({
                        stroke: true
                    });
                    this.renderGroup.add(btemp);
                    this.Walls.push(btemp);
                }
            }
        }
    }

}
