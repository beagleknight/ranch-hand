require('should');
const proxyquire = require('proxyquire');
let scheduleFunction = () => {};
let createScheduler = () => proxyquire('../src/scheduler', {
    'node-schedule': {
        scheduleJob: scheduleFunction
    }
})();


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
        let scheduler, scheduledJobs;
        beforeEach(() => {
            scheduleFunction = () => {
                scheduledJobs++;
            };
            scheduledJobs = 0;
            scheduler = createScheduler();
            scheduler.scheduleRancherCall('cron spec', 'ContainerX');
        });
        describe('When I try to schedule another rancher call to start ContainerX with the same spec', () =>{
            it('Then only one rancher call should be scheduled', () => {
                scheduler.scheduleRancherCall('cron spec', 'ContainerX');
                scheduledJobs.should.equal(1);
            });
        });
        describe('When I try to schedule another rancher call to start ContainerX with a different spec', () =>{
            it('Then two rancher calls should have been scheduled', () => {
                scheduler.scheduleRancherCall('cron spec1', 'ContainerX');
                scheduledJobs.should.equal(2);
            });
        });
    })
});
