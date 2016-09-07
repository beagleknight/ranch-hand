const ranchHand = require('./ranchHand')();
const logger = require('./logging');
const config = require('./config')

logger.logInfo('Starting Ranch-Hand service', {
    rancherInstance: '${config.rancher.protocol}://${config.rancher.host}:${config.rancher.port}',
    checkInterval: config.checkInterval
});

ranchHand.start().then(logger.logInfo('Started scheduler'));
