const createRancherCheckScheduler = require('./rancherCheckScheduler');
const createRancherInterface = require('./rancher');

module.exports = (config) => {
    config = config || require('./config')();
    const rancherInterface = createRancherInterface(config);
    const rancherCheckScheduler = createRancherCheckScheduler(rancherInterface, config);
    return {
        start: () => rancherCheckScheduler.start()
    }
}
