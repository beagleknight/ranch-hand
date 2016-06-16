module.exports = function createMasterScheduler(rancher, config){
    return {
        start: function() {
            return rancher.makeRequest(config.label);
        }
    };
};
