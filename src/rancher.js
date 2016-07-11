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
            if(!/2[0-9]{2}/.exec(res.statusCode)) {
                const err = new Error('Non 200 status code from Rancher');
                err.status = res.statusCode;
                reject(err);
            }
            resolve(body);
        });
    });

    return {
        makeRequest: makeHttpRequest
    };
}
