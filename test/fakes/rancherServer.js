'use strict'
const http = require("http");

module.exports = function createFakeRancher(){
    let server = {};
    return {
        start: function(handle, callback) {
            server = http.createServer(handle);
            server.listen(1234, callback);
        },
        stop: function(callback) {
            server.close(callback);
        }
    };
};
