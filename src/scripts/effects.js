
var Effects = (function(obj){

    var player = obj.getPlayer();
    var event = obj.event;

    var effects = {

        "rainbow": function(data) {
            for( i in data.renderList ) {
                data.renderList[i].color = color(data.renderList[i].id%100, 100, 100);
            }
        },

        "moon": function(data) {
            data.player.gravity = 4;
        }

    };

    var activeEffects = [];

    function _render(data) {
        // access to the canvas
        for( e in activeEffects ) {
            activeEffects[e](data);
        }
    }

    event.on("onRender", _render);

    function enable(effect) {
        activeEffects.push(effects[effect]);
    }

    function disable(effect) {
        activeEffects.splice(effects.indexOf(effects[effect]), 1);
    }

    return {
        effects: effects,
        enable: enable,
        activeEffects: activeEffects
    };

});
