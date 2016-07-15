const nodeSchedule = require('node-schedule');
const logger = require('../logging');
const moment = require('moment');

module.exports = function(rancher) {
    const scheduledChecks = {
    };
    const makeRancherCall = (check, path, spec) => {
        logger.logInfo('making rancher request on spec', {path: path, cron_spec: spec})
        const url = `${path}/?action=restart`;
        rancher.makeRequest(url, 'POST')
            .then(() => logger.logInfo('Restarted', {url: url}))
            .then(() => check.lastRanAt = moment())
            .catch(err => logger.logError('Encountered error running scheduled start', {error_message: err.message, last_request_url:url, error_status: err.status}));
    }

    const scheduleAndSave = (name, path, spec) => {
        scheduledChecks[name] = {};
        scheduledChecks[name].job = nodeSchedule.scheduleJob(name, spec, makeRancherCall.bind(null, scheduledChecks[name], path, spec));
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
                logger.logInfo(`cancelled job because ${scheduledChecks[name].spec} did not equal ${spec}`, {rancher_path:path});
                scheduleAndSave(name, path, spec);
            }
        },
        scheduledJobs: () => new Promise(resolve => resolve(scheduledChecks))
    }
}
