"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var game;

window.onload = function () {
    game = new Main();
};

var Main = function () {
    function Main() {
        _classCallCheck(this, Main);

        this.width = 0;
        this.height = 0;

        this.ground = [];

        this.highscore = 0;
        this.crashes = 0;

        this.playerSkin = Assets.skins[0];

        this.init();
    }

    _createClass(Main, [{
        key: "init",
        value: function init() {

            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.blockSize = 18;

            if (screen.width > 720) {
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
    }, {
        key: "initScene",
        value: function initScene() {

            this.score = 0;
            this.camera = new _Camera(-this.width / 2, 0);
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
                x: this.width / 3,
                y: 0,
                r: this.blockSize / 2,
                w: this.blockSize,
                h: this.blockSize,
                rigid: true,
                collider: true
            }).sprite(this.getCurentSkin());
            this.Renderer.addToRenderGroup("player", this.player);
        }
    }, {
        key: "run",
        value: function run() {
            // game logic
            console.log("Running.");
            this.Renderer.run();
        }
    }, {
        key: "pause",
        value: function pause() {
            console.log("Paused.");
            this.Renderer.pause();
        }
    }, {
        key: "resume",
        value: function resume() {
            console.log("Resuming.");
            this.Renderer.resume();
        }
    }, {
        key: "reset",
        value: function reset() {
            this.ground = [];
            this.Renderer.renderGroups = [];
            this.initScene();
            this.run();
        }
    }, {
        key: "onRender",
        value: function onRender() {

            var bs = this.blockSize;
            var w = this.width / bs;

            for (var i = this.ground.length; i--;) {
                if (-this.ground[i].location.x < this.camera.location.x) {
                    this.ground.splice(this.ground[this.ground.indexOf(this.ground[i])], 1);
                }
            }

            var rge = this.Renderer.getRenderGroup("walls").elements;
            for (var _i in rge) {
                if (-rge[_i].location.x - this.width / 2 > this.camera.location.x) {
                    rge.splice(_i, 1);
                }
            }

            if (this.ground.length < this.width / bs) {
                var id = this.ground.length > 0 ? this.ground[this.ground.length - 1].id++ : 0;
                var btemp = new Block(id, {
                    x: bs * id,
                    y: -bs / 2,
                    w: bs,
                    h: bs
                }).rect();
                this.Renderer.addToRenderGroup("ground", btemp);
                this.ground.unshift(btemp);

                if (id > w) {

                    var rg = this.Renderer.renderGroups.walls.elements;

                    var spaceing = this.score / 1000000 * (11 - 7) + 7; // spacing between walls
                    var probability = this.score / 1000000 * (1 - 0.3) + 0.3; // from 0 to 1

                    var lid = rg.length > 0 ? rg[0].id : 0;
                    var a = lid < id - spaceing;
                    var b = Math.random() < probability;

                    if (a && b || lid == 0) {
                        var _rg = this.Renderer.getRenderGroup("walls");
                        new Structure(bs, id, _rg);
                    }
                }
            }

            this.Renderer.drawText(this.camera, 45, this.score.toString(), this.width - this.width / 80, 60);

            this.camera.location.x -= 3;
            this.player.location.x += 3;
        }
    }, {
        key: "onUpdate",
        value: function onUpdate(dt) {
            // on update
            this.score += 1;
            //this.camera.location.x -= 190 * dt;
            //this.player.location.x += 190 * dt;
        }
    }, {
        key: "gameOver",
        value: function gameOver() {
            this.pause();
            this.crashes++;
            if (this.highscore < this.score) {
                this.highscore = this.score;
            }
            setSaveValue("_crashes", this.crashes);
            setSaveValue("_highscore", this.highscore);
            this.Menu.gameover();
            $(".score")[0].innerText = this.score;
            $(".highscore")[0].innerText = this.highscore;
        }
    }, {
        key: "getHighscore",
        value: function getHighscore() {
            return this.highscore;
        }
    }, {
        key: "getCrashes",
        value: function getCrashes() {}
    }, {
        key: "getCurentSkin",
        value: function getCurentSkin() {
            return this.playerSkin;
        }
    }, {
        key: "setCurrentSkin",
        value: function setCurrentSkin(skin) {
            this.playerSkin = skin;
        }
    }]);

    return Main;
}();

var Player = function (_Entity) {
    _inherits(Player, _Entity);

    function Player(a) {
        _classCallCheck(this, Player);

        var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, a));

        _this.clickCounter = 0;
        _this.airborn = true;
        _this.jumpPower = 650;
        _this.gravity = -9.81 / 2;

        _this.history = [];
        return _this;
    }

    _createClass(Player, [{
        key: "jump",
        value: function jump() {
            if (!this.airborn || this.clickCounter < 2) {
                this.velocity.y = this.jumpPower;
                this.clickCounter++;
                this.airborn = true;
            }
        }
    }, {
        key: "onCollide",
        value: function onCollide() {
            if (this.location.y <= 0 + this.attr.r) {
                this.airborn = false;
                this.clickCounter = 0;
                this.location.y = 0 + this.attr.r;
            }
        }
    }, {
        key: "onAnimate",
        value: function onAnimate() {
            if (this.airborn) this.sprite.x = 4;
        }
    }, {
        key: "onRender",
        value: function onRender() {
            this.keepHistory();
        }
    }, {
        key: "keepHistory",
        value: function keepHistory() {
            this.history.unshift({
                r: this.attr.r,
                x: this.location.x,
                y: this.location.y,
                w: this.attr.w,
                h: this.attr.h
            });
            if (this.history.length > 4) {
                this.history.pop();
            }
        }
    }]);

    return Player;
}(Entity);

var Block = function (_Entity2) {
    _inherits(Block, _Entity2);

    function Block(b, a) {
        _classCallCheck(this, Block);

        var _this2 = _possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).call(this, a));

        _this2.id = b;
        return _this2;
    }

    _createClass(Block, [{
        key: "onCollide",
        value: function onCollide() {
            //collision
            if (this.location.y <= 0 + this.attr.r) {
                this.airborn = false;
                this.clickCounter = 0;
                this.location.y = 0 + this.attr.r;
            }
        }
    }, {
        key: "onAnimate",
        value: function onAnimate() {
            // if animated sprite
            if (this.airborn) this.sprite.x = 3;
        }
    }]);

    return Block;
}(Entity);

var Wall = function (_Entity3) {
    _inherits(Wall, _Entity3);

    function Wall(b, a) {
        _classCallCheck(this, Wall);

        var _this3 = _possibleConstructorReturn(this, (Wall.__proto__ || Object.getPrototypeOf(Wall)).call(this, a));

        _this3.id = b;
        return _this3;
    }

    _createClass(Wall, [{
        key: "onCollide",
        value: function onCollide() {
            //collision
            var playerloc = game.player.location;
            if (this.location.x > playerloc.x - 100) {
                var playerr = game.player.attr.r;
                if (playerloc.x + playerr >= this.location.x - this.attr.w / 2 && playerloc.x - playerr <= this.location.x + this.attr.w / 2) {
                    //x
                    if (playerloc.y + playerr - 1 >= this.location.y - this.attr.h / 2 && playerloc.y - playerr <= this.location.y + this.attr.h / 2) {
                        //y
                        game.gameOver();
                    }
                }
            }
        }
    }]);

    return Wall;
}(Entity);

var Structure = function () {
    function Structure(bs, id, rg) {
        _classCallCheck(this, Structure);

        this.bs = bs; // blocksize
        this.id = id;
        this.renderGroup = rg;
        this.parts = Assets.parts;
        this.part = this.parts[Math.floor(random(this.parts.length - 2))];
        this.data = this.part.data;
        this.rank = this.part.rank;

        this.Walls = [];

        // init structure
        this.build(this.data);
    }

    _createClass(Structure, [{
        key: "build",
        value: function build(data) {
            var bs = this.bs;
            var id = this.id;

            for (var x = data.length; x--;) {
                for (var y in data[x]) {
                    if (data[y][x] == 1) {
                        var btemp = new Wall(id, {
                            x: (id + x) * bs,
                            y: bs * -y + bs * 3.5,
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
    }]);

    return Structure;
}();