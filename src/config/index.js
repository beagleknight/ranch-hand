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

function loadFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, fileData) => {
            if(err) {
                return reject(err);
            }

            resolve(fileData);
        })
    });
}

function parseJson(fileContents) {
    return new Promise(resolve => resolve(JSON.parse(fileContents)));
}

function setConfigFromEnvironmentVariables(parsedConfig) {
    return Object.keys(environmentVariableMappings).reduce((config, key) => {
        if(process.env[key] && !_.get(parsedConfig, environmentVariableMappings[key])) {
            _.set(config, environmentVariableMappings[key], process.env[key])
        }

        return config;
    }, parsedConfig);
}

function setConfigFromDefaults(parsedConfig) {
    return Object.keys(defaults).reduce((config, key) => {
        if(!_.get(parsedConfig, key)) {
            _.set(config, key, defaults[key])
        }

        return config;
    }, parsedConfig);
}

function setDefaultProtocol(parsedConfig) {
    if(parsedConfig.rancher && !parsedConfig.rancher.port) {
        if(parsedConfig.rancher.protocol === 'https') {
            parsedConfig.rancher.port = 443;
        }
        else {
            parsedConfig.rancher.port = 8080;
        }
    }

    return parsedConfig;
}

function setAuth(parsedConfig) {
    if(parsedConfig.rancher && parsedConfig.rancher.apiToken && !parsedConfig.rancher.auth) {
        const authToken = new Buffer(`${parsedConfig.rancher.apiToken}:${parsedConfig.rancher.apiSecret}`, "utf8").toString("base64");
        parsedConfig.rancher.auth = `Basic ${authToken}`;
    }

    return parsedConfig;
}

function setContainerPath(parsedConfig) {
    if(parsedConfig.rancher.environmentId && !parsedConfig.rancher.containerPath) {
        if(!parsedConfig.rancher) {
            parsedConfig.rancher = {};
        }
        parsedConfig.rancher.containerPath = `/v1/projects/${parsedConfig.rancher.environmentId}/containers`;
    }

    return parsedConfig;
}

module.exports = {
    start: () => loadFile(`${__dirname}/config.json`)
        .then(parseJson)
        .then(parsedConfig => new Promise(resolve => resolve([
            setConfigFromEnvironmentVariables,
            setConfigFromDefaults,
            setDefaultProtocol,
            setAuth,
            setContainerPath
        ].reduce((config, configMapper) => configMapper(config), parsedConfig))))
};
