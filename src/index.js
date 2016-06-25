const server = require('./server')();
const logger = require('./logging');

logger.logInfo('Started Ranch-Hand')

server.start();
