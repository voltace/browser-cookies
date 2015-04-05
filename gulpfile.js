var gulp = require('gulp');
var karma = require('karma').server;
var rename = require('gulp-rename');
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
  .pipe(gulp.dest('dist'));
});

// Test run including code coverage and Sauce Labs
// May be run locally or using travis CI
gulp.task('test:full', function (done) {
  // Use ENV vars on Travis and sauce.json locally to get credentials
  if (!process.env.SAUCE_USERNAME) {
    if (!fs.existsSync('sauce.json')) {
      console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
      process.exit(1);
    } else {
      process.env.SAUCE_USERNAME = require('./sauce').username;
      process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
    }
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
