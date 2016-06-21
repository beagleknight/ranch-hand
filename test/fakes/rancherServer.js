'use strict'
const http = require('http');

module.exports = function createFakeRancher(){
    let urls = [];
    let server = {close:() => {}};
    const handleRequest = (req, res) => {
        if(req.url === '/label') {
            res.write(JSON.stringify(require('./responses/label')));
            return res.end()
        }
        urls.push(req.url);
    }
    return {
        start: function() {
            urls = [];
            server = http.createServer(handleRequest);
            return new Promise((resolve) => server.listen(1234, () => {
                console.log('stood up server');
                resolve();
            }));
        },
        stop: function(callback) {
            server.close(callback);
        },
        urls: () => urls
    };
};
