'use strict'
require('should');
const proxyquire =  require('proxyquire');
const config = {
    "host":"localhost",
    "port":1234,
    "checkInterval": 1000,
    "labels":{
        path:"/label"
    },
    "useSecure": false
}
const fakeRancher = require('./fakes/rancherServer')();

const waitToEqual = (data, time, expected) => {
    return new Promise(resolve => setTimeout(() => resolve(data()), time))
        .should.eventually.deepEqual(expected);
}

describe('Given all scheduled jobs happen immediately', () => {
    const scheduler = proxyquire('../src/scheduler', {
        'node-schedule': {
            scheduleJob: (name, spec, job) => job()
        }
    });
    const server = proxyquire('../src/server', {
        './scheduler': scheduler
    })(config);

    describe('when starting some containers', () => {
        it('should ask rancher to start a container', () => {
            return fakeRancher.start()
                .then(() => server.start())
                .then(() => waitToEqual(() => fakeRancher.urls()[0], 50, '/v1/projects/1a16/containers/1i4174/?action=start'))
        });
        afterEach(() => {
            fakeRancher.stop();
        })
    })
});
