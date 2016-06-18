'use strict'
const request = require('request');
module.exports = function createRancherInterface(config) {
    return {
        makeRequest: function(path) {
            return new Promise((resolve, reject) => {
                request.get({
                    url: `http://${config.host}:${config.port}${path}`
                }, (err, data) => {
                    if(err) {
                        reject(err);
                    }
                    resolve(data);
                });
            });
        }
    };
}
