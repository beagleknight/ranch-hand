'use strict'
module.exports = function createMasterScheduler(rancher, config){
    let stopPolling = false;
    const poll = () => {
        if(stopPolling) return;
        rancher.makeRequest(config.label);
        setTimeout(poll, config.interval);
    };

    return {
        start: function() {
            stopPolling = false;
            poll();
        },
        stop: function() {
            stopPolling = true;
        }
    };
};
