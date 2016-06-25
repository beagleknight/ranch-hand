const server = require('./server')();
const logger = require('./logging');

logging.logInfo('Started Ranch-Hand')

server.start();
