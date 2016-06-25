const config = require('./config');
const logging = require('logall');
logging.registerLogger({
	level: 'INFO',
	type: 'logstash',
	eventType: 'ranch-hand',
	codec: 'oldlogstashjson',
	output: {
		transport: 'udp',
		host: config.elasticsearch.host,
		port: config.elasticsearch.port
	}
});

module.exports = logging;
