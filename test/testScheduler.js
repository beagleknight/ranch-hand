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
        it('should ask to schedule a job', () => {
            let scheduledAJob = false;
            scheduleFunction = () => {
                scheduledAJob = true;
            };
            let scheduler = createScheduler();
            scheduler.scheduleRancherCall();
            scheduledAJob.should.equal(true);
        })
    })
});
