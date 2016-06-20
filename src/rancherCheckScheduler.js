'use strict'
module.exports = function createRancherCheckScheduler(scheduler, rancherInterface, config) {
    const checkRancher = () => {
        rancherInterface.makeRequest(config.labels.path)
            .then(containers => {
                JSON.parse(containers).forEach(() => {
                    scheduler.scheduleJob('', () => {})
                });
            })
            .catch(err => {
                console.log('err from rancher', err);
            });
    }
    return {
        start: function() {
            scheduler.scheduleJob(config.updateCron, checkRancher);
        }
    };
};
