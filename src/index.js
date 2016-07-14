const server = require('./ranchHand')();
const logger = require('./logging');

logger.logInfo('Started Ranch-Hand')

server.start();
