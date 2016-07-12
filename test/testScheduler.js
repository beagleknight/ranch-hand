require('should');
const proxyquire = require('proxyquire');
let scheduleFunction = () => {};
let createScheduler = (rancher) => proxyquire('../src/scheduler', {
    'node-schedule': {
        scheduleJob: scheduleFunction
    }
})(rancher);


describe('Scheduling Checks', () => {
    describe('scheduling a check', () => {
        it('should schedule a check', () => {
            let scheduledAJob = false;
            scheduleFunction = () => {
                scheduledAJob = true;
            };
            let scheduler = createScheduler();
            scheduler.scheduleRancherCall();
            scheduledAJob.should.equal(true);
        });
    });
    describe('Given I have already scheduled a rancher call to start ContainerX', () => {
        let scheduler, scheduledJobs, cancelsCalled;
        beforeEach(() => {
            scheduleFunction = () => {
                scheduledJobs++;
                return {
                    cancel: () => cancelsCalled++
                };
            };
            scheduledJobs = 0;
            cancelsCalled = 0;
            scheduler = createScheduler();
            scheduler.scheduleRancherCall('cron spec', '/path/to/start', 'ContainerX');
        });
        describe('When I try to schedule another rancher call to start ContainerX with the same spec', () =>{
            it('Then only one rancher call should be scheduled', () => {
                scheduler.scheduleRancherCall('cron spec', '/path/to/start', 'ContainerX');
                scheduledJobs.should.equal(1);
            });
        });
        describe('When I try to schedule another rancher call to start ContainerX with a different spec', () =>{
            it('Then two rancher calls should have been scheduled', () => {
                scheduler.scheduleRancherCall('cron spec1', '/path/to/start', 'ContainerX');
                scheduledJobs.should.equal(2);
            });
            it('And one of them should have been cancelled', () => {
                scheduler.scheduleRancherCall('cron spec1', '/path/to/start', 'ContainerX');
                cancelsCalled.should.equal(1);
            })
        });
    });
    describe('Given all scheduled jobs happen immediately', () => {
        let scheduler;
        beforeEach(() => {
            scheduleFunction = (name, spec, job) => job();
        });
        describe('When a job is successfully scheduled and called', () => {
            it('Then a request out to rancher is made', () => {
                const rancher = {
                    makeRequest: path => new Promise(resolve => {
                        path.should.equal('ContainerX/?action=stop');
                        resolve()
                    })
                }
                scheduler = createScheduler(rancher);
                scheduler.scheduleRancherCall('cron spec1', 'ContainerX');
            });
        })
    });
});
