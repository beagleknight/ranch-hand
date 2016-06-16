module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                },
                src: ['test/**/*.js']
            }
        },
        eslint: {
            target: ['src/**/*.js', 'test/**/*.js']
        }
    });

    grunt.registerTask('default', ['eslint', 'mochaTest']);
};
