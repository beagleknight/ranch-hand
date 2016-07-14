const request = require('request');
const logging = require('./logging');

module.exports = function createRancherInterface(config) {
    const makeHttpRequest = (url, method) => new Promise((resolve, reject) => {
        logging.logInfo('Making Rancher request', {url: url});
        request({
            uri: url,
            method: method || 'GET',
            headers: {
                Accept:'application/json',
                Authorization: config.rancher.auth
            },

        }, (err, res, body) => {
            if(err) {
                return reject(err);
            }
            if(!res) {
                return reject(new Error('No response from Rancher'));
            }
            if(!/2[0-9]{2}/.exec(res.statusCode)) {
                const err = new Error('Non 200 status code from Rancher');
                err.status = res.statusCode;
                return reject(err);
            }
            resolve(body);
        });
    });

    return {
        makeRequest: makeHttpRequest
    };
}
