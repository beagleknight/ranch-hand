const http = require('http');
const logger = require('./logging');

module.exports = function createServer(config, scheduler) {
    function handleRequest(req, res) {
        if(req.url === '/'){
            return scheduler.scheduledJobs()
                .then(mapJobs)
                .then(jobs => {
                    res.write(JSON.stringify(jobs))
                    res.end();
                })
                .catch(e => {
                    res.write(e.stack);
                    res.end();
                });
        }
        logger.logInfo('Could not find route', {url: req.url});
        res.end();
    }

    function mapJobs(jobs) {
        return Object.keys(jobs).map(key => {
            const scheduledCheck = jobs[key];
            return {
                name: scheduledCheck.job.name,
                lastRanAt: scheduledCheck.lastRanAt,
                spec: scheduledCheck.spec
            };
        });
    }

    return {
        start: () => {
            const server = http.createServer(handleRequest);
            return new Promise(resolve => server.listen(config.server.port || 1234, () => {
                resolve();
            }));
        }
    }
}
