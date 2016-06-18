'use strict'
require('should');
const body = require('body');
const createMasterScheduler = require('../src/masterSchedule');
const createRancherInterface = require('../src/rancher');
const fakeRancher = require('./fakes/rancherServer')();
const defaultConfig = {
    host:'localhost',
    port:1234,
    interval: 100
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
    describe('Given I have a task scheduled right now', () => {
        let scheduler;
        beforeEach(() => {
            const rancherInterface = createRancherInterface(defaultConfig);
            scheduler = createMasterScheduler(rancherInterface, defaultConfig);
        });
        describe('When executing tasks', () => {
            it('Then a request should go to rancher', () => {
                const urlsRequested = [];
                fakeRancher.start((req, res) => {
                    urlsRequested.push(req.url);
                });
                scheduler.start();
                return new Promise(resolve => setTimeout(() => resolve(urlsRequested), 20))
                    .should.eventually.deepEqual(['/v1/projects/1a16/containers/1i4127/?action=start']);
            })
        });

        afterEach(() => {
            scheduler.stop();
            fakeRancher.stop();
        });
    });
});
