const nodeSchedule = require('node-schedule');
const logger = require('../logging')

module.exports = function(rancher) {
    const scheduledChecks = {
    };
    const makeRancherCall = (path, spec) => {
        logger.logInfo('making rancher request on spec', {path: path, cron_spec: spec})
        rancher.makeRequest(path);
    }

    const scheduleAndSave = (name, path, spec) => {
        scheduledChecks[name] = {};
        scheduledChecks[name].job = nodeSchedule.scheduleJob(name, spec, () => makeRancherCall(path, spec));
        scheduledChecks[name].spec = spec;
        logger.logInfo('scheduled start', {cron_spec: spec, rancher_path:path, service_name:name});
    }

    return {
        scheduleRancherCall: (spec, path, name) => {
            if(!scheduledChecks[name]) {
                return scheduleAndSave(name, path, spec);
            }
            else if(scheduledChecks[name].spec != spec) {
                scheduledChecks[name].job.cancel();
                logger.logInfo('cancelled job', {rancher_path:path});
                scheduleAndSave(name, path, spec);
            }
        }
    }
}
