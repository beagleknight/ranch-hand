const getEsConfig = () => {
    try {
        return require('./config')();
    }
    catch( err) {
        console.log('could not load config, using defaults');
        return {
            elasticsearch:{
                host: "127.0.0.1",
                port:1234
            }
        };
    }
};

const config = getEsConfig();
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
