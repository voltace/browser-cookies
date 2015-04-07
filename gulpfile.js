var gulp = require('gulp');
var karma = require('karma').server;
var rename = require('gulp-rename');
var size = require('gulp-size');
var uglify = require('gulp-uglify');
var util = require('util');

// Defines
var FILENAME_DEV = 'browser-cookies.js';
var FILENAME_MIN = 'browser-cookies.min.js';

// Browsers to run on Sauce Labs (https://saucelabs.com/platforms/)
var customLaunchers = {
  // Mobile
/*Android_40: {browserName: 'android',           version: '4.0'},
  Android_50: {browserName: 'android',           version: '5'},
  iPhone_4:   {browserName: 'iphone',            version: '4'},
  iPhone_6:   {browserName: 'iphone',            version: '6'},
  iPhone_8:   {browserName: 'iphone',            version: '8'},*/

  // Desktop
  Chrome_26:  {browserName: 'chrome',            version: '26'},
  Chrome_41:  {browserName: 'chrome',            version: '41'},
  IE_07:      {browserName: 'internet explorer', version:  '7'},
  IE_08:      {browserName: 'internet explorer', version:  '8'},
  IE_09:      {browserName: 'internet explorer', version:  '9'},
  IE_10:      {browserName: 'internet explorer', version: '10'},
  IE_11:      {browserName: 'internet explorer', version: '11'},
  Firefox_03: {browserName: 'firefox',           version:  '3'},
  Firefox_36: {browserName: 'firefox',           version: '36'},
  Opera_11:   {browserName: 'opera',             version: '11'},
  Safari_5:   {browserName: 'safari',            version:  '5'},
  Safari_8:   {browserName: 'safari',            version:  '8'}
};

// Base Karma configuration, contains everything needed for a local teste run
// The config is extended by gulp tasks below to add coverage/sauselabs/etc
var karmaConfig = {
  basePath: '',
  frameworks: ['jasmine'],
  files: ['browser-cookies.js', 'test.js'],
  reporters: ['progress', 'spec'],
  port: 9876,
  colors: true,
  autoWatch: false,
  singleRun: true,
  preprocessors: {
    'browser-cookies.js': ['wrap'],
  },
  wrapPreprocessor: {
    template: 'function requireCookies(document, Date, exports) { <%= contents %> }'
  },
  browsers: ['PhantomJS'],
  //logLevel: 'DEBUG',
};

// Function to run Karma on Sauce Labs in batches
// so start 3 jobs -> wait for these to finish -> start another 3 jobs -> etc...
function runInSeries(config, browsersPending, done) {
  var parallelJobs = 3;

  // Add new batch to test
  config.browsers = [];
  while(browsersPending.length > 0 && config.browsers.length < parallelJobs) {
    config.browsers.push(browsersPending.pop());
  }
  console.log('Starting new batch:', config.browsers.join(', '));

  // Run Karma
  karma.start(config, function() {
    // Batch finished
    console.log('Finished batch:', config.browsers.join(', '));
    console.log('Remaining browsers to test:', browsersPending.length);

    // We're done if there are no more browsers to test
    if (browsersPending.length === 0) {
      done();
      return;
    }

    // Increase port number, to prevent conflict with previous Karma session that may still be shutting down
    config = util._extend({}, config);
    config.port += 10;

    // Schedule a new batch (using timeout to allow existing karma run to exit before starting a new run)
    setTimeout(function () {
      runInSeries(config, browsersPending, done);
    }, 5000);
  });
}

gulp.task('build', function (done) {
  return gulp.src(FILENAME_DEV)
  .pipe(size({gzip: false, title: FILENAME_DEV + '     size:'}))
  .pipe(uglify())
  .pipe(rename(FILENAME_MIN))
  .pipe(size({gzip: false, title: FILENAME_MIN + ' size:'}))
  .pipe(size({gzip: true,  title: FILENAME_MIN + ' size:'}))
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
  config.preprocessors[FILENAME_DEV].push('coverage');
  config.coverageReporter = {
    dir: 'coverage/',
    reporters: [
      {type: 'lcov', subdir: '.' },
      {type: 'cobertura', subdir: '.', file: 'cobertura.xml'}
    ]
  };

  // Configure Sauce Labs browsers
  for (var launcher in customLaunchers) {
    customLaunchers[launcher].base = 'SauceLabs'; // Use SauceLabs
    customLaunchers[launcher].public = 'public'; // Make results public
    customLaunchers[launcher].tags = [launcher]; // Add browser key as tag

    // If running on TRAVIS use the job number as tunnel-identifier for Sauce Labs
    if (process.env.TRAVIS_JOB_NUMBER !== undefined) {
      customLaunchers[launcher].build                = process.env.TRAVIS_BUILD_NUMBER;
      customLaunchers[launcher]['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
    }
  }

  // Determine starttime of the test (used in test run title).
  var date = new Date();
  var startTime = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);

  // Enable Sauce Labs
  config.reporters.push('saucelabs');
  config.sauceLabs = {testName: 'run ' + startTime};
  config.customLaunchers = customLaunchers;
  //config.browsers = Object.keys(customLaunchers);
  //karma.start(config, done)

  // Run Karma (on Sauce Labs) in batches
  console.log('Starting karma session', config.sauceLabs.testName);
  runInSeries(config, Object.keys(customLaunchers).sort(), done);
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
