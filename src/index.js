const ranchHand = require('./ranchHand')();
const logger = require('./logging');

logger.logInfo('Starting Ranch-Hand service')

ranchHand.start()
    .then(logger.logInfo('Started scheduler'));
