'use strict'
require('should');
const body = require('body');
const createMasterScheduler = require('../src/masterSchedule');
const createRancherInterface = require('../src/rancher');
const fakeRancher = require('./fakes/rancherServer')();
const defaultConfig = {
    host:'localhost',
    port:1234,
    interval: 100,
    basePath: '/v1/projects/1a16',
    label: {
        restart: 'cron-schedule',
        path: '/labels'
    }
};

function getBody(req) {
    return new Promise((resolve, reject) => {
        body(req, (err, bodyData) => {
            if(err) {
                return reject(err);
            }
            return resolve(bodyData);
        });
    });
}

describe('Scheduling Rancher Checks', () => {
    describe('Getting all containers to schedule', () => {
        let scheduler;
        beforeEach(() => {
            const rancherInterface = createRancherInterface(defaultConfig);
            scheduler = createMasterScheduler(rancherInterface, defaultConfig);
        });

        it('should ask for all containers with specific label', () => {
            let urlsRequested = []
            fakeRancher.start((req, res) => {
                res.write(JSON.stringify(require('./data/label-response.json')));
                urlsRequested.push(req.path);
            });
            return scheduler.start()
                .then(() => {
                    return urlsRequested;
                })
                .should.eventually.deepEqual([defaultConfig.label.path, '/v1/projects/1a16/labels/12345/instances'])
        });

        afterEach(() => {
            scheduler.stop()
                .then(() => fakeRancher.stop());
        });
    });
});
