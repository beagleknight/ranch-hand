const ranchHand = require('./ranchHand')();
const logger = require('./logging');

ranchHand.start().then(logger.logInfo('Started scheduler'));
