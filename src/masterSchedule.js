'use strict'
module.exports = function createMasterScheduler(rancher, config){
    let polling = true;
    let timeout;
    const poll = () => {
        if(!polling) return;
        return rancher.makeRequest('/v1/projects/1a16/containers/1i4127/?action=start')
            .then(() => timeout = setTimeout(poll, config.interval));
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
