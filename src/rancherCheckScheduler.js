const scheduler = require('node-schedule');

module.exports = function createRancherCheckScheduler(rancherInterface, config) {
    const checkRancher = () => rancherInterface.makeRequest(config.labels.path)
        .then(containers => {
            const parsedContainers = JSON.parse(containers);
            parsedContainers.data.forEach(container => {
                scheduler.scheduleJob(container.labels.cron_schedule,
                    () => rancherInterface.makeRequest(`${container.links.self}/?action=start`));
            });
        })
        .catch(err => {
            console.log('err from rancher', err);
        });

    return {
        start: function() {
            scheduler.scheduleJob(config.updateCron, checkRancher);
            return new Promise(resolve => resolve());
        }
    };
};
