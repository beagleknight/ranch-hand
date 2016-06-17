const createRancher = require('./rancher');
const createMasterScheduler = require('./masterSchedule');
const getConfig = require('./config');

const run = () => {
    const config = getConfig();
    const rancher = createRancher(config);
    const masterSchedule = createMasterScheduler(rancher, config);
    masterSchedule.start();
}
run();
