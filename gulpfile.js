var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  less = require('gulp-less'),
  webserver = require('gulp-webserver'),
  nodemon = require('gulp-nodemon');

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

gulp.task('bower_components', function () {
  return gulp.src('bower_components')
      .pipe(webserver({
        port: 9001,
        livereload: false,
        directoryListing: false
      }));
});

gulp.task('client', ['bower_components'], function () {
  return gulp.src('app')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      fallback: 'index.html',
      proxies: [
        { source: '/bower_components', target: 'http://localhost:9001/' },
        { source: '/api', target: 'http://localhost:9000/api' }
      ]
    }));
});

gulp.task('canned_server', function () {
  nodemon({ script: './canned_server/server.js', ext: 'js', ignore: ['./app/**'] })
      .on('restart', function () {
        console.log('Canned server restarted')
      })
});

gulp.task('default', ['run']);

gulp.task('run', ['client', 'watch']);