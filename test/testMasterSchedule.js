var should = require('should');
var masterSchedule = require('../src/masterSchedule.js');

describe('Scheduling Rancher Checks', function() {
    describe('Getting all containers to schedule', function () {
        it('should return hello world', function () {
            var scheduler = masterSchedule();
            scheduler.start().should.equal('hello world');
        });
    });
});
