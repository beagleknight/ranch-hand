const fs = require('fs');
const _ = require('lodash');

const environmentVariableMappings = {
    'RANCHER_PROTOCOL': 'rancher.protocol',
    'RANCHER_HOST': 'rancher.host',
    'RANCHER_APITOKEN': 'rancher.apiToken',
    'RANCHER_APISECRET': 'rancher.apiSecret',
    'RANCHER_ENVIRONMENTID': 'rancher.environmentId'
};

const defaults = {
    'checkInterval': 60000,
    'rancher.targetLabel': 'cron_schedule',
    'rancher.protocol': 'https'
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

    parsedConfig = Object.keys(defaults).reduce((config, key) => {
        if(!_.get(parsedConfig, key)) {
            _.set(config, key, defaults[key])
        }

        return config;
    }, parsedConfig);

    if(parsedConfig.rancher && parsedConfig.rancher.apiToken && !parsedConfig.rancher.auth) {
        const authToken = new Buffer(`${parsedConfig.rancher.apiToken}:${parsedConfig.rancher.apiSecret}`, "utf8").toString("base64");
        parsedConfig.rancher.auth = `Basic ${authToken}`;
    }

    if(parsedConfig.rancher.environmentId && !parsedConfig.rancher.containerPath) {
        if(!parsedConfig.rancher) {
            parsedConfig.rancher = {};
        }
        parsedConfig.rancher.containerPath = `/v1/projects/${parsedConfig.rancher.environmentId}/containers`;
    }

    return parsedConfig;
};
