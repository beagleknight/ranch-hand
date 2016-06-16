var should = require('should');
const body = require('body');
var masterSchedule = require('../src/masterSchedule');
var createRancherInterface = require('../src/rancher');
var fakeRancher = require('./fakes/rancherServer')();
const defaultConfig = {
    host:'localhost',
    port:1234,
    label:'something'
};

function getBody(req) {
    return new Promise(function (resolve, reject) {
        body(req, function(err, body) {
            if(err) {
                return reject(err);
            }
            return resolve(body);
        });
    });
}

describe('Scheduling Rancher Checks', function() {
    describe('Getting all containers to schedule', function () {
        it('should send a request to rancher', function (done) {
            fakeRancher.start(function (req) {
                getBody(req)
                    .then(function(body) {
                        body.should.equal('something');
                        done();
                    });
            });
            const rancherInterface = createRancherInterface(defaultConfig);
            const scheduler = masterSchedule(rancherInterface, defaultConfig);
            scheduler.start();
        });

        afterEach(function(){
            fakeRancher.stop();
        });
    });
});
