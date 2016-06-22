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
        let scheduledJobs = 0;
        scheduleFunction = () => {
            scheduledJobs++;
        };
        let scheduler = createScheduler();
        beforeEach(() => {
            scheduler.scheduleRancherCall();
        });
        describe('When I try to schedule another rancher call to start ContainerX', () =>{
            it('Then only one rancher call should be scheduled', () => {
                scheduler.scheduleRancherCall();
                scheduledJobs.should.equal(1);
            });
        });
    })
});
