const should = require('should');
const proxyquire = require('proxyquire');

let fileContents;

const config = proxyquire('../src/config', {
    'fs': {
        readFileSync: () => {
            return fileContents || '';
        }
    }
});

function setConfigFile(config) {
    fileContents = JSON.stringify(config);

    return new Promise(resolve => resolve());
}

function setEnvironmentVariables(environmentVariables) {
    Object.keys(environmentVariables).reduce((allEnvironmentVariables, currentEnvironmentVariableKey) => {
        if(environmentVariables[currentEnvironmentVariableKey]) {
            process.env[currentEnvironmentVariableKey] = environmentVariables[currentEnvironmentVariableKey];
        }

        return allEnvironmentVariables;
    }, process.env);

    return new Promise(resolve => resolve());
}

describe('Load configuration', () => {
    beforeEach(() => {
        Object.keys(process.env).forEach(key => {
            if(key.includes('RANCHER_')) {
                delete process.env[key];
            }
        });

        fileContents = '{}';
    });

    describe('from a file', () => {
        it('loads config from file', () => setConfigFile({ rancher: { protocol: "https" } })
            .then(() => new Promise(resolve => resolve(config())))
            .should.eventually.be.have.propertyByPath('rancher', 'protocol').eql('https'));
    });

    describe('environment variables used if config file value missing', () => {
        it('defaults protocol', () => setEnvironmentVariables({ RANCHER_PROTOCOL: "https" })
            .then(() => new Promise(resolve => resolve(config())))
            .should.eventually.be.have.propertyByPath('rancher', 'protocol').eql('https'));

        it('defaults host', () => setEnvironmentVariables({ RANCHER_HOST: "rancher.example.com" })
            .then(() => new Promise(resolve => resolve(config())))
            .should.eventually.be.have.propertyByPath('rancher', 'host').eql('rancher.example.com'));
    });

    describe('defaults', () => {
        describe('port', () => {
            it('to 443 if protocol is https', () => setConfigFile({ rancher: { protocol: "https" } })
                .then(() => new Promise(resolve => resolve(config())))
                .should.eventually.be.have.propertyByPath('rancher', 'port').eql(443));

            it('to 8080 if protocol is http', () => setConfigFile({ rancher: { protocol: "http" } })
                .then(() => new Promise(resolve => resolve(config())))
                .should.eventually.be.have.propertyByPath('rancher', 'port').eql(8080));
        });

        it('checkInterval to 60000 milliseconds', () => (() => new Promise(resolve => resolve(config())))()
            .should.eventually.be.have.property('checkInterval', 60000));
    })
});
