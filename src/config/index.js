let config = require('./config.json');
if(!config) {
    config = require('./defaults.json')
}
module.exports = () => config;
