'use strict'
module.exports = function createMasterScheduler(rancher, config){
    return {
        start: function() {
            rancher.makeRequest(config.label);
        }
    };
};
