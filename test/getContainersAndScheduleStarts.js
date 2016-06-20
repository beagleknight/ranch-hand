'use strict'
require('should');
const config = {
    "host":"http://localhost",
    "port":1234,
    "updateCron": "* * * * * *",
    "labels":{
        path:"/label"
    }
}
const fakeRancher = require('./fakes/bigFakeRancher')();
const server = require('../src/index')(config);

const waitToEqual = (data, time, expected) => {
    return new Promise(resolve => setTimeout(() => resolve(data()), time))
        .should.eventually.deepEqual(expected);
}

describe('Big test', () => {
    it('should start a container', function () {
        this.timeout(0);
        return fakeRancher.start()
            .then(() => server.start())
            .then(() => waitToEqual(() => fakeRancher.urls()[0], 3000, '/v1/projects/1a16/containers/1i4174/?action=start'))
    });
    afterEach(() => {
        fakeRancher.stop();
    })
});
