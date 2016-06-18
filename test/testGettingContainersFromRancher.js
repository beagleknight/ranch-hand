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
    describe('Given my check will run immediately', () => {
        const cronScheduler = {
            scheduleJob: (spec, job) => {
                job();
            }
        }
        describe('When the application starts', () => {
            it('should ask rancher for a label', () => {
                const config = {
                    host: 'localhost',
                    port: 1234,
                    labels: {
                        path:'/a/rancher/resource'
                    }
                }
                const rancherInterface = createRancherInterface(config);
                const rancherCheckScheduler = createRancherCheckScheduler(cronScheduler, rancherInterface, config);
                rancherCheckScheduler.start();
                let urlRequested;
                fakeRancher.start((req) => urlRequested = req.url);
                return new Promise(resolve => setTimeout(() => resolve(urlRequested), 20))
                    .should.eventually.equal('/a/rancher/resource')
            });
        })
    })
});
