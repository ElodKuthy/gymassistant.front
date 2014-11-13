var gulp = require("gulp");
var del = require("del");
var plugins = require("gulp-load-plugins")();

gulp.task("bower_components", function () {
  return gulp.src("bower_components")
      .pipe(plugins.webserver({
        port: 9001,
        livereload: false,
        directoryListing: false
      }));
});

gulp.task("dev:http", ["bower_components"], function () {
    return gulp.src("app")
        .pipe(plugins.webserver({
            livereload: false,
            directoryListing: false,
            open: false,
            fallback: "index.html",
            https: false,
            proxies: [
                {source: "/bower_components", target: "http://localhost:9001/"}
            ]
        }));
});

gulp.task("dev:https", ["bower_components"], function () {
    return gulp.src("app")
        .pipe(plugins.webserver({
            livereload: false,
            directoryListing: false,
            open: false,
            fallback: "index.html",
            https: true,
            proxies: [
                { source: "/bower_components", target: "http://localhost:9001/" }
            ]
        }));
});

gulp.task("clean:dist", function() {
    return del("dist");
});

gulp.task("copy-static", ["clean:dist"], function() {
    return gulp.src(["./app/apple-touch-icon-precomposed.png", "./app/favicon.ico"])
        .pipe(gulp.dest("./dist/public"));
});

gulp.task("copy-fonts", ["clean:dist"], function() {
    return gulp.src("./bower_components/fontawesome/fonts/*.*")
        .pipe(gulp.dest("./dist/public/fonts"));
});

gulp.task("copy-server-js", ["clean:dist"], function() {
    return gulp.src("./server/server.js")
        .pipe(gulp.dest("./dist"));
});

gulp.task("copy-index-js", ["clean:dist"], function() {
    return gulp.src("./server/routes/index.js")
        .pipe(gulp.dest("./dist/routes"));
});

gulp.task("copy-certs", ["clean:dist"], function() {
    return gulp.src("./server/ssl/*.*")
        .pipe(gulp.dest("./dist/ssl"));
});

gulp.task("vendor", ["clean:dist"], function () {
    return gulp.src([
        "./bower_components/modernizr/modernizr.js",
        "./bower_components/jquery/dist/jquery.js",
        "./bower_components/bootstrap/dist/js/bootstrap.js",
        "./bower_components/angular/angular.js",
        "./bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js",
        "./bower_components/angular-animate/angular-animate.js",
        "./bower_components/angular-i18n/angular-locale_hu-hu.js",
        "./bower_components/angular-route/angular-route.js",
        "./bower_components/angular-resource/angular-resource.js",
        "./bower_components/moment/moment.js",
        "./bower_components/angular-moment/angular-moment.js"])
        .pipe(plugins.concat("vendor.min.js"))
        .pipe(plugins.uglify())
        .pipe(gulp.dest("./dist/public/js"));
});

gulp.task("js", ["clean:dist"], function () {
    return gulp.src(["./app/**/*.module.js", "./app/**/*.js"])
        .pipe(plugins.concat("all.min.js"))
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.uglify())
        .pipe(gulp.dest("./dist/public/js"));
});

gulp.task("css", ["clean:dist"], function () {
    return gulp.src(["./bower_components/bootstrap/dist/css/bootstrap.css",
        "./bower_components/bootstrap/dist/css/bootstrap-theme.css",
        "./bower_components/fontawesome/css/font-awesome.css",
        "./app/**/*.css"])
        .pipe(plugins.concat("all.min.css"))
        .pipe(plugins.csso())
        .pipe(gulp.dest("./dist/public/css"));
});

gulp.task("html_replace", ["clean:dist"], function () {
    gulp.src("./app/**/*.html")
        .pipe(plugins.htmlReplace({
            "css": "/css/all.min.css",
            "js": "/js/all.min.js",
            "vendor": "/js/vendor.min.js"
        }))
        .pipe(gulp.dest("dist/views"));
});

gulp.task("default", ["build"]);

gulp.task("copy", ["clean:dist", "copy-static", "copy-fonts", "copy-server-js", "copy-index-js", "copy-certs"]);

gulp.task("build", ["clean:dist", "copy", "css", "vendor", "js", "html_replace"]);