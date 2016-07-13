const proxyquire = require('proxyquire');

describe('Talking to Rancher', () => {
    describe('Error handler', () => {
        it('should throw an error when a non 200 response code is returned', () => {
            const rancherInterface = proxyquire('../src/rancher.js', {
                'request':  function get(options, callback) {
                    callback(null, {statusCode:500});
                }
            })({});

            return rancherInterface.makeRequest()
                .catch(e => e.message.should.equal('Non 200 status code from Rancher'))
        });

        it('should reject with an error when one is returned', () => {
            const rancherInterface = proxyquire('../src/rancher.js', {
                'request': function get(options, callback) {
                    callback(new Error('boogety boo'));
                }
            })({});

            return rancherInterface.makeRequest()
                .catch(e => e.message.should.equal('boogety boo'));
        });
    });
    it('should send the response body back', () => {
        const rancherInterface = proxyquire('../src/rancher.js', {
            'request': function get(options, callback) {
                callback(null, {statusCode:200}, {foo: 'bar'});
            }
        })({});

        return rancherInterface.makeRequest()
            .then(body => body.should.deepEqual({foo: 'bar'}))
    })
});
