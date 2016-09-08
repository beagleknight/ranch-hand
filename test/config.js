const should = require('should');
const proxyquire = require('proxyquire');

let fileContents;

const config = proxyquire('../src/config', {
    'fs': {
        readFileSync: () => {
            return fileContents || '';
        },
        readFile: (path, options, cb) => {
            cb(null, fileContents || '')
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
            .then(() => config.start())
            .should.eventually.be.have.propertyByPath('rancher', 'protocol').eql('https'));
    });

    describe('environment variables used if config file value missing', () => {
        it('defaults protocol', () => setEnvironmentVariables({ RANCHER_PROTOCOL: "https" })
            .then(() => config.start())
            .should.eventually.be.have.propertyByPath('rancher', 'protocol').eql('https'));

        it('defaults host', () => setEnvironmentVariables({ RANCHER_HOST: "rancher.example.com" })
            .then(() => config.start())
            .should.eventually.be.have.propertyByPath('rancher', 'host').eql('rancher.example.com'));
    });

    describe('defaults', () => {
        it('protocol to https', () => (() => config.start())()
            .should.eventually.be.have.propertyByPath('rancher', 'protocol').eql('https'));

        describe('port', () => {
            it('to 443 if protocol is https', () => setConfigFile({ rancher: { protocol: "https" } })
                .then(() => config.start())
                .should.eventually.be.have.propertyByPath('rancher', 'port').eql(443));

            it('to 8080 if protocol is http', () => setConfigFile({ rancher: { protocol: "http" } })
                .then(() => config.start())
                .should.eventually.be.have.propertyByPath('rancher', 'port').eql(8080));

            it('port to 443 if protocol is defaulted to https', () => (() => config.start())()
                .should.eventually.be.have.propertyByPath('rancher', 'port').eql(443));
        });

        it('checkInterval to 60000 milliseconds', () => (() => config.start())()
            .should.eventually.be.have.property('checkInterval', 60000));

        it('targetLabel to "cron_schedule"', () => (() => config.start())()
            .should.eventually.be.have.propertyByPath('rancher', 'targetLabel').eql("cron_schedule"));
    });

    describe('auth', () => {
        it('sets basic property when apiToken and apiSecret set', () => setEnvironmentVariables({
                RANCHER_APITOKEN: "abcdef12345",
                RANCHER_APISECRET: "xyz123"
            })
            .then(() => config.start())
            .should.eventually.be.have.propertyByPath('rancher', 'auth').eql("Basic YWJjZGVmMTIzNDU6eHl6MTIz"));
    });

    describe('containerPath', () => {
        it('set to path with projectId set', () => setEnvironmentVariables({
                RANCHER_ENVIRONMENTID: "1a00"
            })
            .then(() => config.start())
            .should.eventually.be.have.propertyByPath('rancher', 'containerPath').eql("/v1/projects/1a00/containers"));
    });
});
