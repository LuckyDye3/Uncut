
let game;

let highscore, score, crashes;

/*window.onload = function() {


    game = new _Renderer({ 
		width: window.innerWidth, 
		height: window.innerHeight, 
		class:"canvas", 
		bgColor: "#000", 
		vp: $("canvas") [0]
	});
	game.run();

};*/

class _Input {

    constructor() {


    }

    bindEvents() {

    }

    keyPressed(key) {
	
    }

}

class RenderGroup {
    constructor(name) {
        this._self = name;
        this.elements = [];
        this.render = true;
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

    constructor(s = { camera: new _Camera(0,0), settings: null }) {
        this.running = false;
        this.viewport = null;
        this.renderGroups = {};

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

    createViewport(a = { width:600, height:600, class:"canvas", bgColor: "#000", vp: false }) {
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
        let tempCanvas = document.getElementsByTagName("canvas");
        if(tempCanvas.length == 0) {
            canvas = document.createElement("canvas");
            canvas.className = c;
            canvas.width = w;
            canvas.height = h;
            document.body.appendChild(canvas);
        } else {
            canvas = tempCanvas[0];
        }
        return canvas;
    }

    run() {

        let lasttick;
        const updaterate = 1/128;
        let interval = 0;
        let framerate;
		
        let loop = (curtick) => {
            if(lasttick) {
                interval += (curtick - lasttick)/1000;
                this.input();
                while(interval > updaterate) {
                    this.update(updaterate);
                    this.tickrate = (curtick - lasttick);
                    interval -= updaterate;
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

    input() {
        // TODO: check input from Input class, pressed keys n stuff
    }

    draw(camera = { location: new Location(0,0) }) {
        this.clearCanvas();
        // make camera relative to the canvas center
        let origin = new Location(
            this.viewport.width/2 + camera.location.x,
            this.viewport.height/2 + camera.location.y
        );
		
		let vprt = this.viewport;
        let ctx = vprt.context;
		Uncut.render(ctx); 

        for( let i of Object.keys(this.renderGroups)) {
            let group = this.renderGroups[i];
            if(group.render) {
                for( let e of group.elements ) {
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
                                e.attr.h
                            );
                            break;
                    }
                    try {
                        e.onDraw(this.tickrate);
                    } catch (e) { }
                }
            }
        }
    }

    update(dt) {
        for( let i of Object.keys(this.renderGroups)) {
            let group = this.renderGroups[i];
            if(group.render) {
                for( let e of group.elements ) {
                    if(e.attr.rigid) {
                        e.update(dt);
                    }
                }
            }
        }
    }

    clearCanvas() {
        let vprt = this.viewport;
        let ctx = vprt.context;
        ctx.beginPath();
        ctx.rect(0, 0, vprt.width, vprt.height);
        ctx.fillStyle = vprt.bgColor;
        ctx.fill();
        ctx.closePath();
    }

    drawRect(camera, loc, w, h, color = "#fff") {
        this.viewport.context.beginPath();
        this.viewport.context.rect(loc.x + camera.x - w/2, loc.y * -1 + camera.y - h/2, w, h);
        this.viewport.context.fillStyle = color;
        this.viewport.context.fill();
        this.viewport.context.closePath();
    }

    drawArc(camera, loc, r, color = "#fff") {
        this.viewport.context.beginPath();
        this.viewport.context.arc(loc.x + camera.x, loc.y * -1 + camera.y, r, 0, 2*Math.PI);
        this.viewport.context.fillStyle = color;
        this.viewport.context.fill();
        this.viewport.context.closePath();
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
        this.renderGroups[group].elements.unshift(entity);
        return this.renderGroups[group];
    }

    // Getters

    isRunning() { return this.running; }
    getViewport() { return this.viewport; }
    getRenderGroup(g) { return this.renderGroups[g]; }
    getCamera() { return this.camera; }

}

class Sprite {

    constructor(a = { x: 0, y: 0, width: 1, height: 1, type: "STATIC", frames: [], fps: 30 }) {

        this.x = a.x;
        this.y = a.y;
        this.width = a.width || 1;
        this.height = a.height || 1;
        this.type = a.type;
        this.resolution = 64;

        if(this.type == "ANIMATION") {
            this.animation = {
                tickCounter: 0,
                curframe: 0,
                frames: a.frames,
                fps: a.fps
            }
        }

        this.img = new Image();
        this.src = this.img.src = 'sprites/Sprites.png';

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

    rect() {
        this.type = "RECT";
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
        if(this.sprite.type == "ANIMATION")
            this.sprite.animate(dt);
            try {
                this.onAnimate();
            } catch (e) { }
    }

    update(dt) {
        if(this.attr.rigid)
            this.simulate(dt);
        if(this.attr.collider)
            this.collide();
    }

    simulate(dt) {
        this.velocity.y += this.force.y + this.gravity * 2;
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

class Player extends Entity {

    constructor(a) {
        super(a);
        this.clickCounter = 0;
        this.airborn = true;
        this.jumpPower = 800;
    }

    jump() {
        if(!this.airborn || this.clickCounter < 2) {
            this.velocity.y = this.jumpPower;
            this.clickCounter++;
            this.airborn = true;
        }
    }

    onCollide() {
        if(this.location.y <= 0 + this.attr.w/2) {
            this.location.y = 0 + this.attr.w/2;
            this.velocity.y = 0;
            this.clickCounter = 0;
            this.airborn = false;
        }
    }

    onAnimate() {
        if(this.airborn)
            this.sprite.x = 3;
    }

}