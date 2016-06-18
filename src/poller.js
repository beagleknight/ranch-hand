'use strict'
module.exports = function createPoller(executor, config){
    let polling = true;
    let timeout;
    const poll = () => {
        if(!polling) return;
        executor.registerTask('/v1/projects/1a16/containers/1i4127/?action=start')
        timeout = setTimeout(poll, config.interval);
    };

    return {
        start: function() {
            polling = true;
            poll();
        },
        stop: function() {
            polling = false;
            clearTimeout(timeout);
        }
    };
};
