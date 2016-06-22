const nodeSchedule = require('node-schedule');

module.exports = function(rancher) {
    const scheduledChecks = {};
    const makeRancherCall = path => {
        rancher.makeRequest(path);
    }

    const scheduleAndSave = (path, spec) => {
        scheduledChecks[path] = {};
        scheduledChecks[path].job = nodeSchedule.scheduleJob(path, spec, () => makeRancherCall(path));
        scheduledChecks[path].spec = spec;
    }

    return {
        scheduleRancherCall: (spec, path) => {
            if(!scheduledChecks[path]) {
                return scheduleAndSave(path, spec);
            }
            else if(scheduledChecks[path].spec != spec) {
                scheduledChecks[path].job.cancel();
                scheduleAndSave(path, spec);
            }
        }
    }
}
