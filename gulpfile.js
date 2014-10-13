var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  less = require('gulp-less'),
  webserver = require('gulp-webserver'),
  prism = require('connect-prism');

gulp.task('html', function () {
  return gulp.src('./app/**/*.html');
 });

gulp.task('js', function () {
  return gulp.src('./app/**/*.js');
 });

gulp.task('less', function () {
  return gulp.src('./app/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./app/css'));
 });

gulp.task('watch', function () {
  gulp.watch(['./app/**/*.html'], ['html']);
  gulp.watch(['./app/js/**/*.js'], ['js']);
  gulp.watch(['./app/less/*.less'], ['less']);
});

gulp.task('prism:mock', function () {
  prism.create({
      name: 'serve',
      mode: 'mock' || 'proxy',
      context: '/api',
      host: 'localhost',
      port: 9000,
      delay: 'auto',
      hashFullRequest: true
    });
});

gulp.task('webserver', function () {
  return gulp.src('app')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      middlewares: [ prism.middleware ],
      fallback: 'index.html'
    }));
});

gulp.task('default', ['run']);

gulp.task('run', ['webserver', 'prism:mock', 'watch']);