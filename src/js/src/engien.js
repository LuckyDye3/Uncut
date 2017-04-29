
class _Input {

    constructor(main) {
		this._pressed = {};
        this.main = main;

        if(screen.width > 1024) {
            document.addEventListener("mousedown", this.onClick.bind(this), false);
        } else {
            document.addEventListener("touchstart", this.onClick.bind(this), false);
        }

    }

    onPress(e) {
		this._pressed[key] = false;
        this._pressed[key] = true;
    }

	onClick(e) {
        let jump = this.main.player.jump.bind(this.main.player);
        jump();
	}

    bindKey(key, callback) {
		if(this._pressed[key.toUpperCase()]) {
            callback();
        }
    }

}

class _Menu {

    constructor(main) {

        this.main = main;

        this.domCach = $(".main");

        this.startScreen = this.domCach.find(".startScreen");
        this.deadScreen = this.domCach.find(".deadScreen");
        this.unlocksScreen = this.domCach.find(".unlocksScreen");
        this.unlockslist = this.domCach.find(".unlocksScreen .unlockslist");

        this.clear();
        this.startScreen.removeClass("hidden");

        this.update();
        this.bindEvents();
    }

    update() {

        this.getGameData(this.main);

        this.domCach.find(".highscore")[1].innerHTML = this.main.highscore;
        this.domCach.find(".crashes")[0].innerHTML = this.main.crashes;

    }

    getGameData(b) {
        getSaveValue("_highscore", function(hscore) {
            if(hscore) {
                b.highscore = hscore;
            }
        });

        getSaveValue("_crashes", function(val) {
            if(val) {
                b.crashes = val;
            }
        });
    }

    bindEvents() {
        this.domCach.find(".playBtn")[0].addEventListener("click", this.play.bind(this));
        this.domCach.find(".unlocksBtn")[0].addEventListener("click", this.unlocks.bind(this));
        this.domCach.find(".retry.Btn")[0].addEventListener("click", this.play.bind(this));
        this.domCach.find(".back.Btn")[0].addEventListener("click", this.back.bind(this));
        this.domCach.find(".back.Btn")[1].addEventListener("click", this.back.bind(this));
    }

    clear() {
        this.startScreen.addClass("hidden");
        this.unlocksScreen.addClass("hidden");
        this.deadScreen.addClass("hidden");
    }

    play() {
        game.reset();
        this.clear();
    }

    unlocks() {
        this.main.Unlocks.update();
        this.startScreen.removeClass("hidden");
        this.unlocksScreen.addClass("hidden");
        this.deadScreen.removeClass("hidden");
    }

    back() {
        this.main.pause();
        this.getGameData(this.main);
        this.update();
        this.clear();
        this.startScreen.removeClass("hidden");
    }

    gameover() {
        this.clear();
        this.deadScreen.removeClass("hidden");
    }

}

class RenderGroup {
    constructor(name) {
        this._self = name;
        this.elements = [];
        this.render = true;
    }

    add(entity) {
        this.elements.unshift(entity);
        return this;
    }
}

class _Camera {

    constructor(x, y) {
        this.location = new Location(x, y);
    }

}

class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(loc) {
        this.x += loc.x;
        this.y += loc.y;
    }
    mult(i) {
        this.x *= i;
        this.y *= i;
    }
}

class Location extends Vector {
    constructor(x, y, z) {
        super(x, y, z);

        this.getX = () => { this.x }
        this.getY = () => { this.y }
        this.getZ = () => { this.z }
    }
}

class _Renderer {

    constructor(main, s = { camera: null, settings: null }) {
        this.running = false;
        this.viewport = null;
        this.renderGroups = {};

        this.main = main;

        this.camera = s.camera;

        this.viewport = this.createViewport(s.settings);
    }

    addRenderGroup(name) {
        if(!this.renderGroups[name]) {
            let rg = new RenderGroup(name);
            this.renderGroups[name] = (rg);
            return this.renderGroups[name];
        }
    }

    createViewport(a = { width:600, height:600, class:"canvas", bgColor: "#000" }) {
        let canvas = this.createCanvas(a.width, a.height, a.class);
        let context = canvas.getContext('2d');
        let bgColor = a.bgColor;

        return {
            canvas: canvas,
            context: context,
            width: canvas.width,
            height: canvas.height,
            bgColor: bgColor
        };
    }

    createCanvas(w, h, c) {
        let canvas;
        let tempCanvas = $(".canvas");
        if(tempCanvas.length == 0) {
            canvas = document.createElement("canvas");
            canvas.className = c;
            canvas.width = w;
            canvas.height = h;
            document.body.getElementsByTagName("div")[0].appendChild(canvas);
        } else {
            canvas = tempCanvas[0];
        }
        return canvas;
    }

    run() {

        let lasttick;
        const updaterate = 1/508;
        let interval = 0;

        let loop = (curtick) => {

            if(lasttick) {
                interval += (curtick - lasttick)/1000;
                while(interval > updaterate) {
                    if(this.running) {
                        this.tickrate = (curtick - lasttick);
                        interval -= updaterate;
                        this.update(updaterate, this.tickrate);
                    } else {
                        break;
                    }
                }
                this.draw(this.camera);
            }
            this.framerate = 1000/(curtick - lasttick);
            lasttick = curtick;

            if(this.running) {
                window.requestAnimationFrame(loop.bind(this));
            }
        }

        if(!this.running) {
            this.running = true;
            loop();
        }

    }

    pause() {
        this.running = false;
    }

    resume() {
        if(!this.running) {
            this.run();
        }
    }

    draw(camera = { location: new Location(0,0) }) {
        this.clearCanvas();
        // make camera relative to the canvas center
        let origin = new Location(
            this.viewport.width/2 + camera.location.x,
            this.viewport.height/2 + camera.location.y
        );
        let count = 0;
        for( let i of Object.keys(this.renderGroups)) {
            let group = this.renderGroups[i];
            if(group.render) {
                for( let e of group.elements ) {
                    if( -e.location.x < this.camera.location.x + this.viewport.width/2 + 30 &&
                        -e.location.x > this.camera.location.x - this.viewport.width/2 - 30) {
                        count++;
                        switch(e.type) {
                            case "SPRITE":
                                this.drawSprite(
                                    origin,
                                    e.sprite,
                                    e.location,
                                    e.attr.w,
                                    e.attr.h
                                );
                                break;
                            case "CIRCLE":
                                this.drawArc(
                                    origin,
                                    e.location,
                                    e.attr.r,
                                    e.attr.color
                                );
                                break;
                                break;
                            case "RECT":
                                this.drawRect(
                                    origin,
                                    e.location,
                                    e.attr.w,
                                    e.attr.h,
                                    e.color,
                                    e.stroke
                                );
                                break;
                        }
                        try {
                            e.onDraw(this.tickrate);
                        } catch (e) { }
                    }
                }
                //console.log(count); //count of objects on screen
            }
        }
        try {
            this.main.onRender();
        } catch(err) { console.error(err); }
    }

    update(dt) {
        for( let i of Object.keys(this.renderGroups)) {
            let group = this.renderGroups[i];
            if(group.render) {
                for( let e of group.elements ) {
                    e.update(dt);
                }
            }
        }
        try {
            this.main.onUpdate(dt);
        } catch(err) { console.error(err); }
    }

    clearCanvas() {
        let ctx = this.viewport.context;
        ctx.clearRect(0, 0, this.viewport.width, this.viewport.height);
    }

    drawText(camera, size, text, x, y) {
        // size in px
        this.viewport.context.textAlign = "right";
        this.viewport.context.font = 'bold ' + size + 'px sans-serif';
        this.viewport.context.fillText(text, x, y + this.viewport.height/2);
    }

    drawRect(camera, loc, w, h, color = "#fff", s) {
        this.viewport.context.beginPath();
        let x = loc.x + camera.x - w/2;
        let y = loc.y * -1 + camera.y - h/2;
        this.viewport.context.rect(Math.floor(x), Math.floor(y), w, h);
        if(s) {
            this.viewport.context.strokeStyle = "black";
            this.viewport.context.stroke();
        }
        this.viewport.context.fillStyle = color;
        this.viewport.context.fill();
        this.viewport.context.closePath();
    }

    drawArc(camera, loc, r, color = "#fff") {
        let x = loc.x + camera.x;
        let y = loc.y * -1 + camera.y;
        this.viewport.context.arc(x, y, r, 0, 2*Math.PI);
        this.viewport.context.fillStyle = color;
        this.viewport.context.fill();
    }

    drawSprite(camera, sprite, loc, w, h) {

        this.viewport.context.drawImage(
            sprite.img,
            sprite.x * sprite.resolution,
            sprite.y * sprite.resolution,
            sprite.resolution * sprite.width,
            sprite.resolution * sprite.height - 0.35,
            Math.round(loc.x + camera.x - w/2),
            Math.round(loc.y * -1 + camera.y - h/2),
            w,
            h
        );
    }

    // Setter

    addToRenderGroup(group, entity) {
        this.getRenderGroup(group).add(entity);
    }

    // Getters

    isRunning() { return this.running; }
    getViewport() { return this.viewport; }
    getRenderGroup(g) { return this.renderGroups[g]; }
    getCamera() { return this.camera; }

}

class Sprite {

    constructor(a = { x: 0, y: 0, res: 64, width: 1, height: 1, type: "STATIC", frames: [], fps: 30 }) {

        this.x = a.x;
        this.y = a.y;
        this.width = a.width || 1;
        this.height = a.height || 1;
        this.type = a.type;
        this.resolution = a.res;

        if(this.type == "ANIMATION") {
            this.animation = {
                tickCounter: 0,
                curframe: 0,
                frames: a.frames,
                fps: a.fps
            }
        }

        this.img = Assets.getSprite();

    }

    animate(dt) {

        let anim = this.animation;
        anim.tickCounter += dt;
        let frameTick = (1/anim.fps)*1000;
        if(anim.tickCounter >= frameTick) {
            anim.tickCounter = 0;
            anim.curframe++;
            this.x = anim.frames[anim.curframe%(anim.frames.length)];
        }

    }

}

class Entity {

    constructor(a = { color: "#fff", x: 0, y: 0, w: 0, h: 0, r: 0, rigid: false, collider: false }) {
        this.location = new Location(a.x, a.y);
        this.force = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.gravity = -9.81;
        this.attr = {
            color: a.color,
            w: a.w,
            h: a.h,
            r: a.r,
            rigid: a.rigid,
            collider: a.collider
        };
    }

    rect(a = { stroke: false }) {
        this.type = "RECT";
        this.stroke = a.stroke;
        return this;
    }

    circle() {
        this.type = "CIRCLE";
        return this;
    }

    sprite(a) {
        this.type = "SPRITE";
        this.sprite = new Sprite(a);
        return this;
    }

    onDraw(dt) {
        if(this.sprite.type == "ANIMATION") {
            this.sprite.animate(dt);
            try {
                this.onAnimate();
            } catch (e) { }
        }
        try {
            this.onRender();
        } catch(err) {  }
    }

    update(dt, tr) {
        if(this.attr.rigid)
            this.simulate(dt);
        if(this.attr.collider)
            this.collide();
    }

    simulate(dt) {
        let mass = 1;
        this.velocity.y += this.force.y + this.gravity * mass;
        this.velocity.x += this.force.x;

        this.location.x += (this.velocity.x * 0.9) * dt;
        this.location.y += (this.velocity.y * 0.9) * dt;

        this.force.mult(0);
    }

    collide() {
        try {
            this.onCollide();
        } catch(err) { }
    }

}

class _Unlocks {

    constructor(main) {
        this.main = main;

        this.availableUnlocks = [];
        this.activeUnlocks = [];
        this.doneUnlocks = [];
        this.shownUnlocks = 5;
        this.cachedDom = $(".unlocksScreen");

        this.update();
    }

    _renderUi() {
        let unlocksList = this.cachedDom.find(".unlocksList")[0];
        let doneunlocksList = this.cachedDom.find(".doneunlocksList")[0];
        unlocksList.innerHTML = "";
        for( let u in this.activeUnlocks ) {
            var div = document.createElement("div");
            div.className = "unlocksItem";
            unlocksList.appendChild(div);
            var title = document.createElement("span");
            title.className = "title";
            title.innerText = this.activeUnlocks[u].title;
            div.appendChild(title);
            var progress = document.createElement("span");
            progress.className = "progress";
            progress.innerText = this.activeUnlocks[u].progress + " / " + this.activeUnlocks[u].value;
            div.appendChild(progress);
        }
        doneunlocksList.innerHTML = "";

        for( let u in this.doneUnlocks ) {
            var div = document.createElement("div");
            div.className = "unlocksItem";
            doneunlocksList.appendChild(div);
            var title = document.createElement("span");
            title.className = "title";
            title.innerText = this.doneUnlocks[u].title;
            div.style.opacity = 0.5;
            div.appendChild(title);
            var progress = document.createElement("span");
            progress.className = "progress";
            progress.innerText = this.doneUnlocks[u].description;
            div.appendChild(progress);
        }
    }

    update() {

        // add unlock to active list
        for(let i = this.availableUnlocks.length; i--;) {
            this.setActive(this.availableUnlocks[i]);
        }
        for(let k = this.activeUnlocks.length; k--;) {
            let o = this.activeUnlocks;
            let aim = parseInt(o[k].aim());
            o[k].progress = aim;
            if(o[k].value <= aim) {
                try {
                    let func = o[k].f.bind(this.main);
                    func();
                } catch(err) {} finally {
                    this.setDone(o[k]);
                }
            }
        }

        this._renderUi();
    }

    setActive(u) {
        this.activeUnlocks.push(u);
        this.availableUnlocks.splice(this.availableUnlocks.indexOf(u), 1);
    }

    setDone(u) {
        this.doneUnlocks.push(u);
        this.activeUnlocks.splice(this.activeUnlocks.indexOf(u), 1);
    }

    createUnlock(a) {
        this.availableUnlocks.push( new Unlock(a) );
        this.update();
    }
}

class Unlock {

    constructor(obj = { title: "none", target: 0, f: null, dec: "none", aim: highscore }) {
        this.title = obj.title;
        this.value = obj.target;
        this.progress = 0;
        this.f = obj.f; // function
        this.description = obj.desc ? obj.desc : "none";
        this.aim = obj.aim;
    }

}