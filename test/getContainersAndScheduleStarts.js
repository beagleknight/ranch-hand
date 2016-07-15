'use strict'
require('should');
const proxyquire =  require('proxyquire');
const config = {
    "rancher": {
        "protocol": "http",
        "host":"localhost",
        "port":1234,
        "containerPath":"/containers",
        "targetLabel": "cron_spec"
    },
    "server": {
        "port": 1000
    },
    "checkInterval": 1000
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
    const ranchHand = proxyquire('../src/ranchHand', {
        './scheduler': scheduler
    })(config);

    describe('when starting some containers', () => {
        it('should ask rancher to start a container', () => {
            return fakeRancher.start()
                .then(() => ranchHand.start())
                .then(() => waitToEqual(() => fakeRancher.urls(), 50, ['/v1/projects/1a16/containers/1i4174/?action=restart']))
        });
        afterEach(() => {
            fakeRancher.stop();
        })
    })
});
