const createRancherCheckScheduler = require('./rancherCheckScheduler');
const createRancher = require('./rancher');
const createScheduler = require('./scheduler');
const createServer = require('./server');
const config = require('./config');


module.exports = () => ({
    start: () => config.start()
        .then(config => {
            const rancher = createRancher(config);
            const scheduler = createScheduler(rancher);
            const server = createServer(config, scheduler);
            const rancherCheckScheduler = createRancherCheckScheduler(scheduler, rancher, config);

            require('./logging').logInfo('Starting Ranch-Hand service', {
                rancherInstance: `${config.rancher.protocol}://${config.rancher.host}:${config.rancher.port}`,
                rancherEnvironmentId: config.rancher.environmentId,
                checkInterval: config.checkInterval
            });

            return [
                rancherCheckScheduler.start(),
                server.start()
            ];
        })
})
