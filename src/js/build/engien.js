"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Input = function () {
    function _Input(main) {
        _classCallCheck(this, _Input);

        this._pressed = {};
        this.main = main;

        if (screen.width > 1024) {
            document.addEventListener("mousedown", this.onClick.bind(this), false);
        } else {
            document.addEventListener("touchstart", this.onClick.bind(this), false);
        }
    }

    _createClass(_Input, [{
        key: "onPress",
        value: function onPress(e) {
            this._pressed[key] = false;
            this._pressed[key] = true;
        }
    }, {
        key: "onClick",
        value: function onClick(e) {
            var jump = this.main.player.jump.bind(this.main.player);
            jump();
        }
    }, {
        key: "bindKey",
        value: function bindKey(key, callback) {
            if (this._pressed[key.toUpperCase()]) {
                callback();
            }
        }
    }]);

    return _Input;
}();

var _Menu = function () {
    function _Menu(main) {
        _classCallCheck(this, _Menu);

        this.main = main;

        this.domCach = $(".main");

        this.startScreen = this.domCach.find(".startScreen");
        this.deadScreen = this.domCach.find(".deadScreen");
        this.unlocksScreen = this.domCach.find(".unlocksScreen");
        this.unlockslist = this.domCach.find(".unlocksScreen .unlockslist");
        this.HUDDom = this.domCach.find("#HUD");
        this.scoreDisplay = this.HUDDom.find(".scoreDisplay");

        this.clear();
        this.startScreen.removeClass("hidden");

        this.update();
        this.bindEvents();

        var scoreDisplay = this.scoreDisplay[0];

        this.HUD = {
            setScore: function setScore(s) {
                scoreDisplay.innerText = s;
            }
        };
    }

    _createClass(_Menu, [{
        key: "update",
        value: function update() {

            this.getGameData(this.main);

            this.domCach.find(".highscore")[1].innerHTML = this.main.highscore;
            this.domCach.find(".crashes")[0].innerHTML = this.main.crashes;
        }
    }, {
        key: "getGameData",
        value: function getGameData(b) {
            getSaveValue("_highscore", function (hscore) {
                if (hscore) {
                    b.highscore = hscore;
                }
            });

            getSaveValue("_crashes", function (val) {
                if (val) {
                    b.crashes = val;
                }
            });

            getSaveValue("_totalscore", function (val) {
                if (val) {
                    b.totalscore = parseInt(val);
                }
            });
        }
    }, {
        key: "bindEvents",
        value: function bindEvents() {
            this.domCach.find(".playBtn")[0].addEventListener("click", this.play.bind(this));
            this.domCach.find(".unlocksBtn")[0].addEventListener("click", this.unlocks.bind(this));
            this.domCach.find(".retry.Btn")[0].addEventListener("click", this.play.bind(this));
            this.domCach.find(".back.Btn")[0].addEventListener("click", this.back.bind(this));
            this.domCach.find(".back.Btn")[1].addEventListener("click", this.back.bind(this));
        }
    }, {
        key: "clear",
        value: function clear() {
            this.startScreen.addClass("hidden");
            this.unlocksScreen.addClass("hidden");
            this.deadScreen.addClass("hidden");
            this.HUDDom.addClass("hidden");
        }
    }, {
        key: "play",
        value: function play() {
            game.reset();
            this.clear();
            this.HUDDom.removeClass("hidden");
        }
    }, {
        key: "unlocks",
        value: function unlocks() {
            this.main.Unlocks.update();
            this.clear();
            this.unlocksScreen.removeClass("hidden");
        }
    }, {
        key: "back",
        value: function back() {
            this.main.pause();
            this.getGameData(this.main);
            this.update();
            this.clear();
            this.startScreen.removeClass("hidden");
        }
    }, {
        key: "gameover",
        value: function gameover() {
            this.clear();
            this.deadScreen.removeClass("hidden");
        }
    }]);

    return _Menu;
}();

var RenderGroup = function () {
    function RenderGroup(name) {
        _classCallCheck(this, RenderGroup);

        this._self = name;
        this.elements = [];
        this.render = true;
    }

    _createClass(RenderGroup, [{
        key: "add",
        value: function add(entity) {
            this.elements.unshift(entity);
            return this;
        }
    }]);

    return RenderGroup;
}();

var _Camera = function _Camera(x, y) {
    _classCallCheck(this, _Camera);

    this.location = new Location(x, y);
};

var Vector = function () {
    function Vector(x, y, z) {
        _classCallCheck(this, Vector);

        this.x = x;
        this.y = y;
        this.z = z;
    }

    _createClass(Vector, [{
        key: "add",
        value: function add(loc) {
            this.x += loc.x;
            this.y += loc.y;
        }
    }, {
        key: "mult",
        value: function mult(i) {
            this.x *= i;
            this.y *= i;
        }
    }]);

    return Vector;
}();

var Location = function (_Vector) {
    _inherits(Location, _Vector);

    function Location(x, y, z) {
        _classCallCheck(this, Location);

        var _this = _possibleConstructorReturn(this, (Location.__proto__ || Object.getPrototypeOf(Location)).call(this, x, y, z));

        _this.getY = function () {
            _this.y;
        };
        _this.getZ = function () {
            _this.z;
        };
        return _this;
    }

    _createClass(Location, [{
        key: "getX",
        value: function getX() {
            return this.x;
        }
    }]);

    return Location;
}(Vector);

var _Renderer = function () {
    function _Renderer(main) {
        var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { camera: null, settings: null };

        _classCallCheck(this, _Renderer);

        this.running = false;
        this.viewport = null;
        this.renderGroups = {};

        this.main = main;

        this.camera = s.camera;

        this.viewport = this.createViewport(s.settings);
    }

    _createClass(_Renderer, [{
        key: "addRenderGroup",
        value: function addRenderGroup(name) {
            if (!this.renderGroups[name]) {
                var rg = new RenderGroup(name);
                this.renderGroups[name] = rg;
                return this.renderGroups[name];
            }
        }
    }, {
        key: "createViewport",
        value: function createViewport() {
            var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { width: 600, height: 600, class: "canvas", bgColor: "#000" };

            var canvas = this.createCanvas(a.width, a.height, a.class);
            var context = canvas.getContext('2d');
            var bgColor = a.bgColor;

            return {
                canvas: canvas,
                context: context,
                width: canvas.width,
                height: canvas.height,
                bgColor: bgColor
            };
        }
    }, {
        key: "createCanvas",
        value: function createCanvas(w, h, c) {
            var canvas = void 0;
            var tempCanvas = $(".canvas");
            if (tempCanvas.length == 0) {
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
    }, {
        key: "run",
        value: function run() {

            var MAX_FPS = 60;
            var updaterate = 1 / 508;
            var lasttick = 0;
            var lastframe = 0;
            var interval = 0;
            var main = this;
            var loop = function loop(curtick) {

                if (lasttick) {
                    interval += (curtick - lasttick) / 1000;
                    lastframe += performance.now() - lasttick;

                    while (interval > updaterate) {
                        if (main.running) {
                            main.tickrate = curtick - lasttick;
                            interval -= updaterate;
                            main.update(updaterate, main.tickrate / (100 / main.framerate));
                        } else {
                            break;
                        }
                    }

                    if (lastframe >= 1 / MAX_FPS * 1000) {

                        main.draw(main.camera);
                        main.framerate = 1000 / (curtick - lasttick);
                        lastframe = 0;
                    }
                }
                lasttick = curtick;

                if (main.running) {
                    window.requestAnimationFrame(loop.bind(main));
                }
            };

            if (!this.running) {
                this.running = true;
                loop();
            }
        }
    }, {
        key: "pause",
        value: function pause() {
            this.running = false;
        }
    }, {
        key: "resume",
        value: function resume() {
            if (!this.running) {
                this.run();
            }
        }
    }, {
        key: "draw",
        value: function draw() {
            var camera = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { location: new Location(0, 0) };

            this.clearCanvas();
            // make camera relative to the canvas center
            var origin = new Location(this.viewport.width / 2 + camera.location.x, this.viewport.height / 2 + camera.location.y);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.renderGroups)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var i = _step.value;

                    var group = this.renderGroups[i];
                    if (group.render) {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = group.elements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var e = _step2.value;

                                if (-e.location.x < this.camera.location.x + this.viewport.width / 2 + 30 && -e.location.x > this.camera.location.x - this.viewport.width / 2 - 30) {
                                    switch (e.type) {
                                        case "SPRITE":
                                            this.drawSprite(origin, e.sprite, e.location, e.attr.w, e.attr.h);
                                            break;
                                        case "CIRCLE":
                                            this.drawArc(origin, e.location, e.attr.r, e.attr.color);
                                            break;
                                            break;
                                        case "RECT":
                                            this.drawRect(origin, e.location, e.attr.w, e.attr.h, e.color, e.stroke);
                                            break;
                                    }
                                    try {
                                        e.onDraw(this.tickrate);
                                    } catch (e) {}
                                }
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            try {
                this.main.onRender();
            } catch (err) {
                console.error(err);
            }
        }
    }, {
        key: "update",
        value: function update(dt, tr) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = Object.keys(this.renderGroups)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var i = _step3.value;

                    var group = this.renderGroups[i];
                    if (group.render) {
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = group.elements[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var e = _step4.value;

                                e.update(dt);
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            try {
                this.main.onUpdate(dt, tr);
            } catch (err) {
                console.error(err);
            }
        }
    }, {
        key: "clearCanvas",
        value: function clearCanvas() {
            var ctx = this.viewport.context;
            ctx.clearRect(0, 0, this.viewport.width, 400);
        }
    }, {
        key: "drawText",
        value: function drawText(camera, size, text, x, y) {
            // size in px
            this.viewport.context.textAlign = "right";
            this.viewport.context.font = 'bold ' + size + 'px sans-serif';
            this.viewport.context.fillText(text, x, y + this.viewport.height / 2);
        }
    }, {
        key: "drawRect",
        value: function drawRect(camera, loc, w, h) {
            var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "#fff";
            var s = arguments[5];

            this.viewport.context.beginPath();
            this.viewport.context.rect(Math.floor(loc.x + camera.x - w / 2), Math.floor(loc.y * -1 + camera.y - h / 2), w, h);
            if (s) {
                this.viewport.context.strokeStyle = "black";
                this.viewport.context.stroke();
            }
            this.viewport.context.fillStyle = color;
            this.viewport.context.fill();
            this.viewport.context.closePath();
        }
    }, {
        key: "drawArc",
        value: function drawArc(camera, loc, r) {
            var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "#fff";

            var x = loc.x + camera.x;
            var y = loc.y * -1 + camera.y;
            this.viewport.context.arc(x, y, r, 0, 2 * Math.PI);
            this.viewport.context.fillStyle = color;
            this.viewport.context.fill();
        }
    }, {
        key: "drawSprite",
        value: function drawSprite(camera, sprite, loc, w, h) {

            this.viewport.context.drawImage(sprite.img, sprite.x, sprite.y, sprite.resolution * sprite.width, sprite.resolution * sprite.height, Math.round(loc.x + camera.x - w / 2), Math.round(loc.y * -1 + camera.y - h / 2), w, h);
        }

        // Setter

    }, {
        key: "addToRenderGroup",
        value: function addToRenderGroup(group, entity) {
            this.getRenderGroup(group).add(entity);
        }

        // Getters

    }, {
        key: "isRunning",
        value: function isRunning() {
            return this.running;
        }
    }, {
        key: "getViewport",
        value: function getViewport() {
            return this.viewport;
        }
    }, {
        key: "getRenderGroup",
        value: function getRenderGroup(g) {
            return this.renderGroups[g];
        }
    }, {
        key: "getCamera",
        value: function getCamera() {
            return this.camera;
        }
    }]);

    return _Renderer;
}();

var Sprite = function () {
    function Sprite() {
        var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { x: 0, y: 0, res: 64, width: 1, height: 1, type: "STATIC", frames: [], fps: 30, jumpSprite: false };

        _classCallCheck(this, Sprite);

        this.resolution = a.res;
        this.x = a.x * this.resolution;
        this.y = a.y * this.resolution;
        this.width = a.width || 1;
        this.height = a.height || 1;
        this.type = a.type;
        this.animPaused = false;
        this.jumpSprite = a.jumpSprite;

        if (this.type == "ANIMATION") {
            this.animation = {
                tickCounter: 0,
                curframe: 0,
                frames: a.frames,
                fps: a.fps
            };
        }

        this.img = Assets.SPRITESHEET;
    }

    _createClass(Sprite, [{
        key: "animate",
        value: function animate(dt) {
            if (!this.animPaused) {
                var anim = this.animation;
                anim.tickCounter += dt;
                var frameTick = 1 / anim.fps * 1000;
                if (anim.tickCounter >= frameTick) {
                    anim.tickCounter = 0;
                    anim.curframe++;
                    this.x = anim.frames[anim.curframe % anim.frames.length] * this.resolution;
                }
            }
        }
    }, {
        key: "onAnimate",
        value: function onAnimate() {
            if (this.jumpSprite || this.jumpSprite === 0) {
                this.x = this.jumpSprite * this.resolution;
            }
        }
    }, {
        key: "setPauseAnimation",
        value: function setPauseAnimation(boolean) {
            this.animPaused = boolean;
        }
    }]);

    return Sprite;
}();

var Entity = function () {
    function Entity() {
        var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { camera: this.camera, color: "#fff", x: 0, y: 0, w: 0, h: 0, r: 0, rigid: false, collider: false };

        _classCallCheck(this, Entity);

        this.location = new Location(a.x, a.y);
        this.force = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.gravity = -9.81;
        this.camera = a.camera;
        this.attr = {
            color: a.color,
            w: a.w,
            h: a.h,
            r: a.r,
            rigid: a.rigid,
            collider: a.collider
        };
    }

    _createClass(Entity, [{
        key: "rect",
        value: function rect() {
            var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { stroke: false };

            this.type = "RECT";
            this.stroke = a.stroke;
            return this;
        }
    }, {
        key: "circle",
        value: function circle() {
            this.type = "CIRCLE";
            return this;
        }
    }, {
        key: "sprite",
        value: function sprite(a) {
            this.type = "SPRITE";
            this.sprite = new Sprite(a);
            return this;
        }
    }, {
        key: "onDraw",
        value: function onDraw(dt) {
            if (this.sprite.type == "ANIMATION") {
                this.sprite.animate(dt);
                try {
                    this.onAnimate();
                } catch (e) {}
            };
        }
    }, {
        key: "update",
        value: function update(dt, tr) {
            if (this.attr.rigid) this.simulate(dt);
            if (this.attr.collider) this.collide();
        }
    }, {
        key: "simulate",
        value: function simulate(dt) {
            var mass = 1;
            this.velocity.y += this.force.y + this.gravity * mass;
            this.velocity.x += this.force.x;

            this.location.x += this.velocity.x * 0.9 * dt;
            this.location.y += this.velocity.y * 0.9 * dt;

            this.force.mult(0);
        }
    }, {
        key: "collide",
        value: function collide() {
            try {
                this.onCollide();
            } catch (err) {}
        }
    }]);

    return Entity;
}();

var _Unlocks = function () {
    function _Unlocks(main) {
        _classCallCheck(this, _Unlocks);

        this.main = main;

        this.availableUnlocks = [];
        this.activeUnlocks = [];
        this.doneUnlocks = [];
        this.shownUnlocks = 5;
        this.cachedDom = $(".unlocksScreen"); // Node for Unlock list

        this.update();
    }

    _createClass(_Unlocks, [{
        key: "_renderUi",
        value: function _renderUi() {
            var unlocksList = this.cachedDom.find(".unlocksList")[0];
            var doneunlocksList = this.cachedDom.find(".doneunlocksList")[0];
            unlocksList.innerHTML = "";
            for (var u in this.activeUnlocks) {
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
                var progress_bar = document.createElement("div");
                progress_bar.className = "progress_bar";
                var progressInPercentage = this.activeUnlocks[u].progress / this.activeUnlocks[u].value * 100;
                progress_bar.style.width = progressInPercentage + "%";
                div.appendChild(progress_bar);
            }
            doneunlocksList.innerHTML = "";

            for (var _u in this.doneUnlocks) {
                var div = document.createElement("div");
                div.className = "unlocksItem";
                doneunlocksList.appendChild(div);
                var title = document.createElement("span");
                title.className = "title";
                title.innerText = this.doneUnlocks[_u].title;
                div.style.opacity = 0.5;
                div.appendChild(title);
                var progress = document.createElement("span");
                progress.className = "progress";
                progress.innerText = this.doneUnlocks[_u].description;
                div.appendChild(progress);
            }
        }
    }, {
        key: "update",
        value: function update() {

            // add unlock to active list
            for (var i = this.availableUnlocks.length; i--;) {
                this.setActive(this.availableUnlocks[i]);
            }
            for (var k = this.activeUnlocks.length; k--;) {
                var o = this.activeUnlocks;
                var aim = parseInt(o[k].aim());
                o[k].progress = aim;
                if (o[k].value <= aim) {
                    try {
                        var func = o[k].f.bind(this.main);
                        func();
                    } catch (err) {} finally {
                        this.setDone(o[k]);
                    }
                }
            }

            this._renderUi();
        }
    }, {
        key: "setActive",
        value: function setActive(u) {
            this.activeUnlocks.push(u);
            this.availableUnlocks.splice(this.availableUnlocks.indexOf(u), 1);
        }
    }, {
        key: "setDone",
        value: function setDone(u) {
            this.doneUnlocks.push(u);
            this.activeUnlocks.splice(this.activeUnlocks.indexOf(u), 1);
        }
    }, {
        key: "createUnlock",
        value: function createUnlock(a) {
            this.availableUnlocks.push(new Unlock(a));
            this.update();
        }
    }, {
        key: "getActive",
        value: function getActive() {
            return this.activeUnlocks;
        }
    }, {
        key: "getActiveAmount",
        value: function getActiveAmount() {
            return this.activeUnlocks.length;
        }
    }, {
        key: "getDone",
        value: function getDone() {
            return this.doneUnlocks;
        }
    }, {
        key: "getDoneAmount",
        value: function getDoneAmount() {
            return this.doneUnlocks.length;
        }
    }]);

    return _Unlocks;
}();

var Unlock = function Unlock() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { title: "none", target: 0, f: null, dec: "none", aim: highscore };

    _classCallCheck(this, Unlock);

    this.title = obj.title;
    this.value = obj.target;
    this.progress = 0;
    this.f = obj.f; // function
    this.description = obj.desc ? obj.desc : "none";
    this.aim = obj.aim;
};