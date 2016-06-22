const nodeSchedule = require('node-schedule');

module.exports = function() {
    const scheduledChecks = {};
    return {
        scheduleRancherCall: (spec, path) => {
            if(!scheduledChecks[path] || scheduledChecks[path] != spec) {
                nodeSchedule.scheduleJob(spec);
                scheduledChecks[path] = spec;
            }
        }
    }
}
