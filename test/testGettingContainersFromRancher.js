'use strict'
require('should');
const createRancherCheckScheduler = require('../src/rancherCheckScheduler');
const createRancherInterface = require('../src/rancher')
const fakeRancher = require('./fakes/rancherServer')();

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
        describe('When the application starts', () => {
            it('should ask rancher for a label', () => {
                const rancherInterface = createRancherInterface(config);
                const rancherCheckScheduler = createRancherCheckScheduler(cronScheduler, rancherInterface, config);
                rancherCheckScheduler.start();
                let urlRequested;
                fakeRancher.start((req) => urlRequested = req.url);
                return new Promise(resolve => setTimeout(() => resolve(urlRequested), 20))
                    .should.eventually.equal('/a/rancher/resource')
            });
        });
        describe('And there are some containers with a cron spec label', () => {
            const labelResponse = ['container1', 'container2', 'container3']
            fakeRancher.start((req, res) => {
                res.write(JSON.stringify(containersWithLabel));
                res.end();
            });
            describe('When I ask rancher for the containers to schedule', () => {
                it('there should be a job scheduled for the label check and each container', () => {
                    let jobsScheduled = 0;
                    scheduleJobRan = () => {
                        jobsScheduled++;
                    }
                    const rancherInterface = createRancherInterface(config);
                    const rancherCheckScheduler = createRancherCheckScheduler(cronScheduler, rancherInterface, config);
                    rancherCheckScheduler.start();
                    return new Promise(resolve => setTimeout(() => resolve(jobsScheduled), 50))
                        .should.eventually.equal(4);
                });
            });
        });
    });
    afterEach(() => {
        fakeRancher.stop();
    });
});
