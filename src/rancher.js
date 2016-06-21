const request = require('request');

module.exports = function createRancherInterface(config) {
    const makeHttpRequest = path => new Promise((resolve, reject) => {
        const url = `http://${config.host}:${config.port}${path}`;
        request.get({
            url: url,
            headers: {
                Accept:'application/json',
                Authorization: config.auth
            }
        }, (err, res, body) => {
            if(err) {
                reject(err);
            }
            resolve(body);
        });
    });

    return {
        makeRequest: makeHttpRequest
    };
}
