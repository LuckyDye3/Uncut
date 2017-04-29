"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Assets = new (function () {
    function _Assets() {
        _classCallCheck(this, _Assets);

        this.parts = [{ "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 1]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 1, 0], [1, 1, 1, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 1, 1, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]], "rank": 0 }, { "data": [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 1]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 1]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 0, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [1, 0, 0, 0], [0, 0, 0, 1]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 0], [1, 0, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 0], [1, 1, 1, 0]], "rank": 0 }, { "data": [[0, 0, 1, 0], [0, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 0, 1], [0, 0, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 0, 0], [1, 1, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 1, 1]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 1, 0], [0, 1, 1, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 1, 1]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 0], [1, 1, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 1, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [1, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 1]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 0], [1, 0, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [1, 0, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 0], [1, 0, 0, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0]], "rank": 0 }, { "data": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 0, 0]], "rank": 0 }];

        this.skins = [{ x: 0, y: 0, res: 128, type: "STATIC" }];

        this.spriteSource = 'sprites/Sprites.png';
        var img = new Image();
        img.src = this.spriteSource;
        this.SPRITESHEET = img;
    }

    _createClass(_Assets, [{
        key: "getUnlocks",
        value: function getUnlocks(main) {
            var unlocks = [{ title: "Get highscore", target: 2000000,
                f: function f() {},
                desc: "Blue ball!", aim: main.getHighscore.bind(main) }];
            return unlocks;
        }
    }]);

    return _Assets;
}())();