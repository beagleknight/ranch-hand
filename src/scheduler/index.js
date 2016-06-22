const nodeSchedule = require('node-schedule');

module.exports = function() {
    return {
        scheduleRancherCall: () => {
            nodeSchedule.scheduleJob();
        }
    }
}
