'use strict'
module.exports = function createRancherCheckScheduler(scheduler, rancherInterface, config) {
    const checkRancher = () => {
        rancherInterface.makeRequest(config.labels.path)
    }
    return {
        start: function() {
            scheduler.scheduleJob(config.updateCron, checkRancher);
        }
    };
};
