const http = require('http');
const logger = require('./logging');

module.exports = function createServer(config, scheduler) {
    function handleRequest(req, res) {
        console.log('received req')
        if(req.url === '/'){
            return scheduler.scheduledJobs()
                .then(mapJobs)
                .then(jobs => {
                    console.log('sending response', jobs)
                    res.write(JSON.stringify(jobs))
                    res.end();
                })
                .catch(e => {
                    console.log(e.stack)
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
            console.log('mapping a result', scheduledCheck)
            return {
                name: scheduledCheck.job.name,
                lastRanAt: scheduledCheck.lastRanAt,
                spec: scheduledCheck.spec
            };
        });
    }

    return {
        start: () => {
            console.log('in web server start')
            const server = http.createServer(handleRequest);
            return new Promise(resolve => server.listen(config.server.port, () => {
                console.log('started');
                resolve();
            }));
        }
    }
}
