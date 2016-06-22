const nodeSchedule = require('node-schedule');

module.exports = function(rancher) {
    const scheduledChecks = {};
    const makeRancherCall = path => {
        rancher.makeRequest(path);
    }

    return {
        scheduleRancherCall: (spec, path) => {
            if(!scheduledChecks[path] || scheduledChecks[path] != spec) {
                nodeSchedule.scheduleJob(path, spec, () => makeRancherCall(path));
                scheduledChecks[path] = spec;
            }
        }
    }
}
