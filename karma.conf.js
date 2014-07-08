module.exports = function(config){
    config.set({

        basePath : '.',

        files : [
            'misc/test-lib/jquery-1.8.2.min.js',
            'misc/test-lib/angular.js',
            'misc/test-lib/angular-mocks.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/lib-bValidator/release/scripts/jquery.bvalidator.js',
            'bower_components/lib-plusAsTab/release/scripts/emulatetab.joelpurra.js',
            'bower_components/lib-plusAsTab/release/scripts/plusastab.joelpurra.js',
            'bower_components/lodash/dist/lodash.js',
            'misc/test-lib/helpers.js',
            'src/**/*.js',
            'template/**/*.js'
        ],

        autoWatch : true,

        frameworks: ['jasmine'],

        browsers : ['Chrome'],

        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
        ],

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};