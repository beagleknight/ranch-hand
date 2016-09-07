const fs = require('fs');
const _ = require('lodash');

const environmentVariableMappings = {
    'RANCHER_PROTOCOL': 'rancher.protocol',
    'RANCHER_HOST': 'rancher.host'
};

module.exports = () => {
    const fileContents = fs.readFileSync(`${__dirname}/config.json`, 'utf-8');
    let parsedConfig = JSON.parse(fileContents);

    parsedConfig = Object.keys(environmentVariableMappings).reduce((config, key) => {
        if(process.env[key] && !_.get(parsedConfig, environmentVariableMappings[key])) {
            _.set(config, environmentVariableMappings[key], process.env[key])
        }

        return config;
    }, parsedConfig);

    if(parsedConfig.rancher && !parsedConfig.rancher.port) {
        if(parsedConfig.rancher.protocol === 'https') {
            parsedConfig.rancher.port = 443;
        }
        else {
            parsedConfig.rancher.port = 8080;
        }
    }

    if(!parsedConfig.checkInterval) {
        parsedConfig.checkInterval = 60000;
    }

    return parsedConfig;
};
