'use strict'

module.exports = (rancher) => {
    const paths =[];
    const run = () => {
        paths.forEach(path => {
            rancher.makeRequest(path);
        });
    }
    return {
        registerTask: path => {
            paths.push(path);
            run();
        }
    }
}
