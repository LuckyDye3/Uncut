
var Unlocks = (function(){

    var Unlock = function(t, v, aim) {
        this.title = t;
        this.value = v;
        this.progress = 0;
        this.reward = null; // no rewards yet
        this.aim = aim;
    }

    var availableUnlocks = [];
    var activeUnlocks = [];
    var doneUnlocks = [];

    var shownUnlocks = 5;

    var cachedDom = $(".unlockslist");

    function _renderUi() {
        var unlocksList = cachedDom[0];
        unlocksList.innerHTML = "";
        for( u in activeUnlocks ) {
            var div = document.createElement("div");
            div.className = "unlocksItem";
            unlocksList.appendChild(div);
            var title = document.createElement("span");
            title.className = "title";
            title.innerText = activeUnlocks[u].title;
            div.appendChild(title);
            var progress = document.createElement("span");
            progress.className = "progress";
            progress.innerText = activeUnlocks[u].progress + " / " + activeUnlocks[u].value;
            div.appendChild(progress);
        }
    }

    function update() {

        // add unlock to active list
        for(var i = availableUnlocks.length; i--;) {
            setActive(availableUnlocks[i]);
        }
        for(var k = activeUnlocks.length; k--;) {
            var o = activeUnlocks;
            o[k].progress = o[k].aim();
            if(o[k].value <= o[k].aim()) {
                setDone(o[k]);
            }
        }

        _renderUi();
    }

    function setActive(u) {
        activeUnlocks.push(u);
        availableUnlocks.splice(availableUnlocks.indexOf(u), 1);
    }

    function setDone(u) {
        doneUnlocks.push(u);
        activeUnlocks.splice(activeUnlocks.indexOf(u), 1);
    }

    function createUnlock(t, v, aim) {
        availableUnlocks.push( new Unlock(t, v, aim) );
    }

    return {
        active: activeUnlocks,
        done: doneUnlocks,
        update: update,
        createUnlock: createUnlock
    };

});
