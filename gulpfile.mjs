import gulp from 'gulp';
import karma from 'karma';
import rename from 'gulp-rename';
import size from 'gulp-size';
import uglify from 'gulp-uglify';
import util from 'util';
import wrap from 'gulp-wrap';

// Defines
var FILENAME_DEV = 'src/browser-cookies.js';
var FILENAME_MIN = 'browser-cookies.min.js';
var FILENAME_TST = 'browser-cookies.test.js';

// Base Karma configuration, contains everything needed for a local test run
// The config is extended by gulp tasks below to add coverage/etc
var karmaConfig = {
  basePath: '',
  frameworks: ['jasmine'],
  files: ['dist/' + FILENAME_TST, 'test/spec.js'],
  reporters: ['progress', 'spec'],
  port: 9876,
  colors: true,
  autoWatch: false,
  singleRun: true,
  preprocessors: {},
  //browsers: ['ChromiumHeadless', 'Edge', 'FirefoxHeadless'],
  browsers: ['ChromeHeadless'],
  concurrency: 1
  //logLevel: 'DEBUG'
};

gulp.task('build:production', function (done) {
  return gulp.src(FILENAME_DEV)
  .pipe(size({gzip: false, title: FILENAME_DEV + ' size:'}))
  .pipe(uglify())
  .pipe(rename(FILENAME_MIN))
  .pipe(size({gzip: false, title: FILENAME_MIN + ' size:'}))
  .pipe(size({gzip: true,  title: FILENAME_MIN + ' size:'}))
  .pipe(gulp.dest('dist'));
});

gulp.task('build:test', function (done) {
  return gulp.src(FILENAME_DEV)
    .pipe(rename(FILENAME_TST))
    .pipe(wrap('function requireCookies(document, Date, exports) { <%= contents %> }'))
    .pipe(gulp.dest("dist"));
});

gulp.task('karma:local', function (done) {
  // Copy the Karma config
  var config = util._extend({}, karmaConfig);

  // Run Karma
  new karma.Server(config, done).start();
});

gulp.task('karma:coverage', function (done) {
  // Copy the Karma config
  var config = util._extend({}, karmaConfig);

  // Enable code coverage
  config.reporters.push('coverage');
  config.preprocessors['dist/' + FILENAME_TST] = ['coverage'];
  config.coverageReporter = {
    dir: 'coverage/',
    reporters: [
      {type: 'lcovonly', subdir: '.' }
    ]
  };

  // Run Karma
  new karma.Server(config, done).start();
});

gulp.task('build', gulp.series(['build:production', 'build:test']));
gulp.task('coverage', gulp.series(['build:test', 'karma:coverage']));
gulp.task('localtest', gulp.series(['build:test', 'karma:local']));
