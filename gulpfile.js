var gulp = require('gulp');
var karma = require('karma').server;
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('build', function (done) {
  return gulp.src('index.js')
  .pipe(uglify())
  .pipe(rename('tiny-cookies.min.js'))
  .pipe(gulp.dest('dist'));
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});
