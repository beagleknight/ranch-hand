'use strict'
require('should');
const body = require('body');
const createMasterScheduler = require('../src/masterSchedule');
const createRancherInterface = require('../src/rancher');
const fakeRancher = require('./fakes/rancherServer')();
const defaultConfig = {
    host:'localhost',
    port:1234,
    label:'something',
    interval: 100
};

function getBody(req) {
    return new Promise((resolve, reject) => {
        body(req, (err, body) => {
            if(err) {
                return reject(err);
            }
            return resolve(body);
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

        it('should send a request to rancher', (done) => {
            fakeRancher.start((req) => {
                getBody(req)
                    .then((body) => {
                        body.should.equal('something');
                        done();
                    });
            });
            scheduler.start();
        });

        it('should poll at least 10 times at 100ms interval', () => {
            let numberOfRequests = 0;
            fakeRancher.start(() => numberOfRequests++);
            scheduler.start();

            return new Promise(resolve => setTimeout(() => resolve(numberOfRequests), 1000))
                .should.eventually.equal(10);
        });

        afterEach(() => {
            fakeRancher.stop();
        });
    });
});
