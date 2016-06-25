const logger = require('./logging');
module.exports = function createRancherCheckScheduler(scheduler, rancherInterface, config) {
    const checkRancher = () => {
        rancherInterface.makeRequest(config.labels.path)
            .then(containers => {
                const parsedContainers = JSON.parse(containers);
                parsedContainers.data.forEach(container => {
                    scheduler.scheduleRancherCall(container.labels.cron_schedule, `${container.links.self}/?action=start`);
                });
            })
            .catch(err => {
                logger.error('err from rancher', err);
            });
        setTimeout(checkRancher, config.checkInterval);
    }

    return {
        start: function() {
            checkRancher();
            return new Promise(resolve => resolve());
        }
    };
};
