let game;

let Assets = new class _Assets {

    constructor() {

        this.parts = [
            {"data":[[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,1,1,1]],"rank":3000},
            {"data":[[0,0,0,0],[0,0,1,0],[0,1,1,0],[1,1,1,0]],"rank":6000},
            {"data":[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,1,1,0]],"rank":1000},
            {"data":[[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],"rank":500},
            {"data":[[1,0,0,0],[0,0,0,0],[0,0,0,1],[0,0,0,1]],"rank":3000},
            {"data":[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,1]],"rank":0},
            {"data":[[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,0,0,0]],"rank":0},
            {"data":[[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],"rank":1000},
            {"data":[[0,0,0,0],[0,0,0,0],[1,0,0,0],[0,0,0,1]],"rank":10000},
            {"data":[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],"rank":0},
            {"data":[[0,0,0,0],[0,0,0,1],[0,0,0,0],[1,0,0,0]],"rank":1000},
            {"data":[[0,0,0,0],[0,0,0,0],[0,0,1,0],[1,1,1,0]],"rank":1000},
            {"data":[[0,0,1,0],[0,0,0,0],[1,0,0,0],[1,0,0,0]],"rank":2000},
            {"data":[[0,0,0,0],[0,0,0,0],[1,1,0,1],[0,0,0,0]],"rank":0},
            {"data":[[1,1,0,0],[1,1,0,0],[1,1,0,0],[1,1,0,0]],"rank":10000},
            {"data":[[0,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]],"rank":3000},
            {"data":[[0,0,0,0],[0,0,0,0],[1,1,0,0],[1,1,0,0]],"rank":0},
            {"data":[[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,0,0]],"rank":10000000},
            {"data":[[0,0,0,0],[0,0,0,0],[0,0,1,0],[0,1,1,1]],"rank":50000},
            {"data":[[0,0,0,0],[0,1,0,0],[0,1,1,0],[0,1,1,0]],"rank":50000},
            {"data":[[0,0,0,0],[0,0,1,0],[0,1,1,0],[0,1,1,0]],"rank":50000},
            {"data":[[0,0,0,0],[0,0,0,0],[0,1,1,0],[1,1,1,1]],"rank":50000},
            {"data":[[0,0,0,0],[0,0,0,0],[0,1,0,0],[0,1,0,0]],"rank":500},
            {"data":[[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,1,1,0]],"rank":5000},
            {"data":[[0,0,0,0],[0,0,0,0],[0,1,0,0],[1,1,0,0]],"rank":50000},
            {"data":[[0,0,0,0],[0,0,0,0],[0,1,1,0],[1,1,1,0]],"rank":0},
            {"data":[[0,0,0,0],[1,0,0,0],[0,0,0,1],[0,0,0,1]],"rank":50000},
            {"data":[[0,0,0,0],[0,0,0,1],[1,0,0,1],[1,0,0,0]],"rank":30000}
        ];

        this.skins = [
            { x: 0, y: 0, type: "ANIMATION", frames: [0, 1, 2, 3], fps: 25 },
            { x: 0, y: 0, width: 1, height: 1, type: "STATIC" },
        ];

    }

}

window.onload = function() {
    game = new Main();
};

class Main {

    constructor() {
        this.width = 0;
        this.height = 0;

        this.ground = [];

        this.playerSkin = Assets.skins[0];

        this.init();
    }

    init() {
        this.highscore = 0;
        this.crashes = 0;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.blockSize = 20;

        if(screen.width > 720) {
            this.width = 600;
        }

        this.Menu = new _Menu(this);
        this.Unlocks = new _Unlocks(this);
        this.Input = new _Input();

        this.initScene();

        this.Unlocks.createUnlock({
            title: "Get a highscore of 10000",
            target: 10000,
            f() { this.setCurrentSkin(Assets.skins[0]) },
            desc: "Animation!",
            aim: this.highscore
        });

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
            x: 200,
            y: 0,
            r: 10,
            w: 20,
            h: 20,
            rigid: true,
            collider: true
        }).sprite(this.getCurentSkin());
        this.Renderer.addToRenderGroup("player", this.player);

        document.addEventListener("mousedown", this.player.jump.bind(this.player));
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
        this.Renderer.drawText(this.camera, 25, this.highscore.toString(), this.width - this.width/80, 60 + 23);

        this.camera.location.x -= 3;
        this.player.location.x += 3;
    }

    onUpdate(dt) {
        // on update
        this.score += 1;
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
        this.jumpPower = 700;
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
