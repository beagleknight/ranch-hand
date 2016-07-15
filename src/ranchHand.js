const createRancherCheckScheduler = require('./rancherCheckScheduler');
const createRancher = require('./rancher');
const createScheduler = require('./scheduler');
const createServer = require('./server');

module.exports = (config) => {
    config = config || require('./config')();
    const rancher = createRancher(config);
    const scheduler = createScheduler(rancher);
    const server = createServer(config, scheduler);
    const rancherCheckScheduler = createRancherCheckScheduler(scheduler, rancher, config);
    return {
        start: () => rancherCheckScheduler.start().then(server.start)
    }
}
