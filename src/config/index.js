let config;
try {
    config = require('./config.json');
}
catch (err) {
    console.error("couldn't load config.json, using defaults", err.stack)
}
if(!config) {
    config = require('./defaults.json')
}
module.exports = () => config;
