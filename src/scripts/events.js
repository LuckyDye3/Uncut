
var Events = (function(){

    var events = {};

    function on(event, f) {
        var e = events[event] = [];
        e.push(f);
    }

    function emit(event, d) {
        if(events[event]) {
            Events.events[event].forEach(
                function(f,k,o) {
                    f(d);
                }
            );
        }
    }

    return {
        on: on,
        emit: emit,
        events: events
    };

});
