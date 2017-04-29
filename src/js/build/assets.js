"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Assets = new (function () {
    function _Assets() {
        _classCallCheck(this, _Assets);

        this.parts = [{ "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 1]], "rank": 3000 }, { "data": [[0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 1, 0], [1, 1, 1, 0]], "rank": 6000 }, { "data": [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 1, 1, 0]], "rank": 1000 }, { "data": [[0, 0, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]], "rank": 500 }, { "data": [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 1]], "rank": 3000 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 1]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 0, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]], "rank": 1000 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [1, 0, 0, 0], [0, 0, 0, 1]], "rank": 10000 }, { "data": [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 0], [1, 0, 0, 0]], "rank": 1000 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 0], [1, 1, 1, 0]], "rank": 1000 }, { "data": [[0, 0, 1, 0], [0, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]], "rank": 2000 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 0, 1], [0, 0, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]], "rank": 3000 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 0, 0], [1, 1, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 0, 0]], "rank": 10000000 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 1, 1]], "rank": 50000 }, { "data": [[0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0]], "rank": 50000 }, { "data": [[0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 1, 0], [0, 1, 1, 0]], "rank": 50000 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 1, 1]], "rank": 50000 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]], "rank": 500 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0]], "rank": 5000 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 0], [1, 1, 0, 0]], "rank": 50000 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 1, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [1, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 1]], "rank": 50000 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 1], [1, 0, 0, 1], [1, 0, 0, 0]], "rank": 30000 }];

        this.skins = [{ x: 0, y: 0, res: 128, type: "ANIMATION", frames: [0, 1, 2], fps: 25 }, { x: 0, y: 0, res: 128, type: "STATIC", frames: [0, 1, 2], fps: 25 }];

        this.spriteSource = 'sprites/Sprites.png';
    }

    _createClass(_Assets, [{
        key: "getSprite",
        value: function getSprite() {
            var img = new Image();
            img.src = this.spriteSource;
            return img;
        }
    }, {
        key: "getUnlocks",
        value: function getUnlocks(main) {
            var unlocks = [{ title: "Complete unlocks", target: 5, f: function f() {
                    main.setCurrentSkin(Assets.skins[0]);
                },
                desc: "GG", aim: main.Unlocks.getDoneAmount.bind(main.Unlocks) }, { title: "Get highscore", target: 10000, f: function f() {},
                desc: "Rainbow power!", aim: main.getHighscore.bind(main) }, { title: "Get highscore", target: 50000, f: function f() {},
                desc: "Animation!", aim: main.getHighscore.bind(main) }, { title: "Get crashes", target: 300, f: function f() {},
                desc: "Done", aim: main.getCrashes.bind(main) }, { title: "Get crashes", target: 600, f: function f() {},
                desc: "Done", aim: main.getCrashes.bind(main) }, { title: "Get crashes", target: 900, f: function f() {},
                desc: "Done", aim: main.getCrashes.bind(main) }, { title: "Get crashes", target: 5000, f: function f() {},
                desc: "Turn it off!", aim: main.getHighscore.bind(main) }];
            return unlocks;
        }
    }]);

    return _Assets;
}())();