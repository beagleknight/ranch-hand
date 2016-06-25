const nodeSchedule = require('node-schedule');
const logger = require('../logging')

module.exports = function(rancher) {
    const scheduledChecks = {};
    const makeRancherCall = path => {
        logger.logInfo('making rancher request', {path: path})
        rancher.makeRequest(path);
    }

    const scheduleAndSave = (path, spec) => {
        scheduledChecks[path] = {};
        scheduledChecks[path].job = nodeSchedule.scheduleJob(path, spec, () => makeRancherCall(path));
        scheduledChecks[path].spec = spec;
        logger.logInfo('scheduled start', {cron_spec: spec, rancher_path:path});
    }

    return {
        scheduleRancherCall: (spec, path) => {
            if(!scheduledChecks[path]) {
                return scheduleAndSave(path, spec);
            }
            else if(scheduledChecks[path].spec != spec) {
                scheduledChecks[path].job.cancel();
                logger.logInfo('cancelled job', {rancher_path:path});
                scheduleAndSave(path, spec);
            }
        }
    }
}
