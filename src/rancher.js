'use strict'
const request = require('request');
module.exports = function createRancherInterface(config) {
    return {
        makeRequest: function(path) {
            return new Promise((resolve, reject) => {
                const url = `http://${config.host}:${config.port}${path}`;
                console.log('making request to', url);
                request.get({
                    url: url
                }, (err, res, body) => {
                    if(err) {
                        reject(err);
                    }
                    resolve(body);
                });
            });
        }
    };
}
