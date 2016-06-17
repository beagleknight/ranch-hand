'use strict'
const http = require("http");

module.exports = function createFakeRancher(){
    let server = {};
    return {
        start: function(handle, callback) {
            server = http.createServer(handle);
            return new Promise((resolve) => server.listen(1234, resolve));
        },
        stop: function(callback) {
            server.close(callback);
        }
    };
};
