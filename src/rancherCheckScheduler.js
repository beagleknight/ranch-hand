'use strict'
module.exports = function createRancherCheckScheduler(scheduler, rancherInterface, config) {
    const checkRancher = () => {
        rancherInterface.makeRequest(config.labels.path)
            .then(containers => {
                JSON.parse(containers).data.forEach(container => {
                    scheduler.scheduleJob(container.labels.cron_schedule,
                        () => rancherInterface.makeRequest(`${container.links.self}/?action=start`));
                });
            })
            .catch(err => {
                console.log('err from rancher', err);
            });
    }
    return {
        start: function() {
            scheduler.scheduleJob(config.updateCron, checkRancher);
            return new Promise(resolve => resolve());
        }
    };
};
