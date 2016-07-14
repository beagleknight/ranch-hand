const createRancherCheckScheduler = require('./rancherCheckScheduler');
const createRancher = require('./rancher');
const createScheduler = require('./scheduler');

module.exports = (config) => {
    config = config || require('./config')();
    const rancher = createRancher(config);
    const scheduler = createScheduler(rancher);
    const rancherCheckScheduler = createRancherCheckScheduler(scheduler, rancher, config);
    return {
        start: () => rancherCheckScheduler.start()
    }
}
