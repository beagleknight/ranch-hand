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
            options: {
                configFile: '.eslintrc'
            },
            target: ['src/**/*.js']
        }
    });

    grunt.registerTask('default', ['eslint', 'mochaTest']);
};
