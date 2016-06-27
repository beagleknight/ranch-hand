const logger = require('./logging');
module.exports = function createRancherCheckScheduler(scheduler, rancherInterface, config) {
    const checkRancher = () => {
        logger.logInfo(`Checking for containers with label set`, {path: config.labels.path})
        rancherInterface.makeRequest(config.labels.path)
            .catch(err => logger.logError(`Error from Rancher`, {stack: err.stack}))
            .then(containers => {
                const parsedContainers = JSON.parse(containers);
                parsedContainers.data.forEach(container => {
                    scheduler.scheduleRancherCall(container.labels.cron_schedule, `${container.links.self}/?action=start`);
                });
            })
            .catch(err => logger.logError(`Error while parsing response`, {stack: err.stack}));
        setTimeout(checkRancher, config.checkInterval);
    }

    return {
        start: function() {
            checkRancher();
            return new Promise(resolve => resolve());
        }
    };
};
