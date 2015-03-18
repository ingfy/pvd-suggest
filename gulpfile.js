'use strict';

var gulp    = require('gulp');
var del     = require('del');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');
var plugins = require('gulp-load-plugins')();

var paths = {
  lint: ['./gulpfile.js', './lib/**/*.js'],
  watch: ['./gulpfile.js', './lib/**', './test/**/*.js', '!test/{temp,temp/**}'],
  tests: ['./test/**/*.js', '!test/{temp,temp/**}']
};

var moduleName = 'pvd-suggest';

var plumberConf = {};

if (process.env.CI) {
  plumberConf.errorHandler = function(err) {
    throw err;
  };
}

gulp.task('clean-dist', function () {
    return del(['dist/']);
});

gulp.task('browserify', ['clean-dist'], function () {
  // transform regular node stream to gulp (buffered vinyl) stream

  var browserified = transform(function(filename) {
    var b = browserify();
    b.require(filename, {expose: moduleName});
    return b.bundle();
  });

  return gulp.src('./index.js')
    .pipe(browserified)
        // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('lint', function () {
  return gulp.src(paths.lint)
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('unitTest', function () {
  gulp.src(paths.tests, {cwd: __dirname})
    .pipe(plugins.plumber(plumberConf))
    .pipe(plugins.mocha());
});

gulp.task('watch', ['test'], function () {
  gulp.watch(paths.watch, ['test']);
});

gulp.task('test', ['lint', 'unitTest']);

gulp.task('default', ['test']);
