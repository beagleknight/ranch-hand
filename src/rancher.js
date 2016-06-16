var request = require('request');
module.exports = function createRancherInterface(config) {
    return {
        makeRequest: function(label) {
            request.get({
                url: 'http://' + config.host + ':' + config.port,
                body:label
            });
        }
    };
};
