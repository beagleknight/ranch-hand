'use strict'
require('should');
const body = require('body');
const createPoller = require('../src/poller');
const createRancherInterface = require('../src/rancher');
const createTaskExecutor = require('../src/taskExecutor');
const fakeRancher = require('./fakes/rancherServer')();
const defaultConfig = {
    host:'localhost',
    port:1234,
    interval: 100
};

describe('Scheduling Rancher Checks', () => {
    describe('Given I have a task scheduled right now', () => {
        let poller;
        beforeEach(() => {
            const rancherInterface = createRancherInterface(defaultConfig);
            const taskExecutor = createTaskExecutor(rancherInterface);
            poller = createPoller(taskExecutor, defaultConfig);
        });
        describe('When executing tasks', () => {
            it('Then a request should go to rancher', () => {
                const urlsRequested = [];
                fakeRancher.start((req, res) => {
                    urlsRequested.push(req.url);
                });
                poller.start();
                return new Promise(resolve => setTimeout(() => resolve(urlsRequested), 20))
                    .should.eventually.deepEqual(['/v1/projects/1a16/containers/1i4127/?action=start']);
            })
        });

        afterEach(() => {
            poller.stop();
            fakeRancher.stop();
        });
    });
});
