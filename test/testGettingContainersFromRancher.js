'use strict'
require('should');
const createRancherCheckScheduler = require('../src/rancherCheckScheduler');
const createRancherInterface = require('../src/rancher')
const fakeRancher = require('./fakes/rancherServer')();

const waitToEqual = (data, time, expected) => {
    return new Promise(resolve => setTimeout(() => resolve(data()), time))
        .should.eventually.equal(expected);
}

describe('Scheduling Rancher Checks', () => {
    describe('When the application starts', () => {
        it('should schedule a job to run at the configured frequency', () => {
            const cronScheduler = {
                scheduleJob: spec => spec.should.equal('/5 * * * *')
            }
            const rancherCheckScheduler = createRancherCheckScheduler(cronScheduler, {}, {updateCron: '/5 * * * *'});
            rancherCheckScheduler.start();
        });
    });
    describe('Given a rancher check will run immediately', () => {
        let scheduleJobRan = () => {};
        const config = {
            host: 'localhost',
            port: 1234,
            labels: {
                path:'/a/rancher/resource'
            }
        }
        const cronScheduler = {
            scheduleJob: (spec, job) => {
                job();
                scheduleJobRan();
            }
        }
        beforeEach(() => {
            const rancherInterface = createRancherInterface(config);
            const rancherCheckScheduler = createRancherCheckScheduler(cronScheduler, rancherInterface, config);
            rancherCheckScheduler.start();
        })
        describe('When the application starts', () => {
            it('should ask rancher for a label', () => {
                let urlRequested;
                fakeRancher.start((req) => urlRequested = req.url);
                return waitToEqual(() => urlRequested, 20, '/a/rancher/resource');
            });
        });
        describe('And there are some containers with a cron spec label', () => {
            beforeEach(() => {
                const labelResponse = ['container1', 'container2', 'container3']
                fakeRancher.start((req, res) => {
                    res.write(JSON.stringify(labelResponse));
                    res.end();
                });
            });
            describe('When I ask rancher for the containers to schedule', () => {
                it('should have a job scheduled for each container', () => {
                    let jobsScheduled = 0;
                    scheduleJobRan = () => {
                        jobsScheduled++;
                    }
                    return waitToEqual(() => jobsScheduled, 20, 3)
                });
            });
        });
    });
    afterEach(() => {
        fakeRancher.stop();
    });
});
