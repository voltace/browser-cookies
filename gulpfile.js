var gulp = require('gulp');
var karma = require('karma').server;
var rename = require('gulp-rename');
var size = require('gulp-size');
var uglify = require('gulp-uglify');
var util = require('util');

// Browsers to run on Sauce Labs
// available: https://npmjs.org/browse/keyword/karma-launcher
var customLaunchers = {
  'SL_Chrome': {
    base: 'SauceLabs',
    browserName: 'chrome'
  },
  'SL_Firefox': { // FIXME IE != Firefox ??
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '9'
  }
};

// Base Karma configuration, contains everything needed for a local teste run
// The config is extended by gulp tasks below to add coverage/sauselabs/etc
var karmaConfig = {
  basePath: '',
  frameworks: ['jasmine'],
  files: ['index.js', 'test.js'],
  reporters: ['progress', 'spec'],
  port: 9876,
  colors: true,
  autoWatch: false,
  singleRun: true,
  preprocessors: {
    'index.js': ['wrap'],
  },
  wrapPreprocessor: {
    template: 'function requireTinyCookies(document, Date, exports) { <%= contents %> }'
  },
  browsers: ['PhantomJS']
  //logLevel: config.LOG_WARN,
};

gulp.task('build', function (done) {
  return gulp.src('index.js')
  .pipe(uglify())
  .pipe(rename('tiny-cookies.min.js'))
  .pipe(size({gzip: true}))
  .pipe(gulp.dest('dist'));
});

// Test run including code coverage and Sauce Labs
// May be run locally or using travis CI
gulp.task('test:full', function (done) {
  // Check whether Sause Labs credentials are configured
  if (!process.env.SAUCE_USERNAME) {
    console.log('SAUCE_USERNAME and SAUSE_ACCESS_KEY must be configured as ENV vars');
    process.exit(1);
  }

  // Copy the Karma config
  var config = util._extend({}, karmaConfig);

  // Stop after the test run has finishsed
  config.singleRun = true;

  // Enable code coverage
  config.reporters.push('coverage');
  config.preprocessors['index.js'].push('coverage');
  config.coverageReporter = {
    dir: 'coverage/',
    reporters: [
      {type: 'lcov', subdir: '.' },
      {type: 'cobertura', subdir: '.', file: 'cobertura.xml'}
    ]
  };


  // Configure Sauce Labs browsers
  for (var launcher in customLaunchers) {
    // If running on TRAVIS use the job number as tunnel-identifier for Sauce Labs
    if (process.env.TRAVIS_JOB_NUMBER !== undefined) {
      customLaunchers[launcher].build                = process.env.TRAVIS_BUILD_NUMBER;
      customLaunchers[launcher]['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
    }

    // Make results public
    customLaunchers[launcher].public = 'public';
  }

  // Enable Sauce Labs
  config.reporters.push('saucelabs');
  config.sauceLabs = {testName: 'tiny-cookies karma'};
  config.captureTimeout = 120000;
  config.customLaunchers = customLaunchers;
  config.browsers = Object.keys(customLaunchers);

  // Run karma
  karma.start(config, done);
});

// Execute tests on local system
gulp.task('test:local', function (done) {
  // Copy the Karma config
  var config = util._extend({}, karmaConfig);

  // Stop after the test run has finishsed
  config.singleRun = true; // Run only once

  // Run Karma
  karma.start(config, done);
});
