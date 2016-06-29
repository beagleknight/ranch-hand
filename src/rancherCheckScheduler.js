const logger = require('./logging');

const mapContainers = parsed => parsed.data.map(container => {
    const startLink = `${container.links.self}/?action=start`;
    return {
        labels: container.labels,
        startLink: startLink,
        name: container.name
    }
})


module.exports = function createRancherCheckScheduler(scheduler, rancherInterface, config) {
    const getAllContainers = () => {
        const containerPath = config.containerPath;
        const targetLabel = 'cron_schedule';
        logger.logInfo(`Checking and scheduling containers with label set`, {path: containerPath, label:targetLabel})
        rancherInterface.makeRequest(containerPath)
            .catch(err => logger.logError(`Error from Rancher`, {stack: err.stack}))
            .then(responseBody => JSON.parse(responseBody))
            .then(mapContainers)
            .then(containers => {
                containers.forEach(container => {
                    if(container.labels && container.labels[targetLabel]) {
                        scheduler.scheduleRancherCall(container.labels[targetLabel], container.startLink, container.name);
                    }
                })
            })
            .catch(err => logger.logError(`Error while parsing response`, {stack: err.stack}));
        setTimeout(getAllContainers, config.checkInterval);
    }

    return {
        start: function() {
            getAllContainers();
            return new Promise(resolve => resolve());
        }
    };
};
