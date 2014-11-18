var gulp = require("gulp");
var del = require("del");
var plugins = require("gulp-load-plugins")();

gulp.task("bower_components", function () {
  return gulp.src("bower_components")
      .pipe(plugins.webserver({
        port: 8002
      }));
});

gulp.task("run:app", ["bower_components"], function () {
    return gulp.src("app")
        .pipe(plugins.webserver({
            fallback: "index.html",
            https:  {
                key: "ssl/key.pem",
                cert: "ssl/cert.pem"
            },
            port: 8001,
            proxies: [
                { source: "/bower_components", target: "http://localhost:8002/" }
            ]
        }));
});

gulp.task("run:dist", function () {
    return gulp.src("dist")
        .pipe(plugins.webserver({
            fallback: "index.html",
            https:  {
                key: "ssl/key.pem",
                cert: "ssl/cert.pem"
            },
            port: 8001
        }));
});

gulp.task("clean:dist", function(cb) {
    return del("dist", cb);
});

gulp.task("copy:static", ["clean:dist"], function() {
    return gulp.src(["app/apple-touch-icon-precomposed.png", "app/favicon.ico"], { base: "app"})
        .pipe(gulp.dest("dist"));
});

gulp.task("copy:fonts", ["clean:dist"], function() {
    return gulp.src("./bower_components/fontawesome/fonts/*.*")
        .pipe(gulp.dest("dist/fonts"));
});

gulp.task("vendor", ["clean:dist"], function () {
    return gulp.src([
        ".bower_components/modernizr/modernizr.js",
        "bower_components/jquery/dist/jquery.js",
        "bower_components/bootstrap/dist/js/bootstrap.js",
        "bower_components/angular/angular.js",
        "bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js",
        "bower_components/angular-animate/angular-animate.js",
        "bower_components/angular-i18n/angular-locale_hu-hu.js",
        "bower_components/angular-route/angular-route.js",
        "bower_components/angular-resource/angular-resource.js",
        "bower_components/moment/moment.js",
        "bower_components/angular-moment/angular-moment.js"])
        .pipe(plugins.concat("vendor.min.js"))
        .pipe(plugins.uglify())
        .pipe(gulp.dest("dist/js"));
});

gulp.task("js", ["clean:dist"], function () {
    return gulp.src(["app/**/*.module.js", "app/**/*.js"])
        .pipe(plugins.concat("all.min.js"))
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.uglify())
        .pipe(gulp.dest("dist/js"));
});

gulp.task("css", ["clean:dist"], function () {
    return gulp.src([
        "bower_components/bootstrap/dist/css/bootstrap.css",
        "bower_components/bootstrap/dist/css/bootstrap-theme.css",
        "bower_components/fontawesome/css/font-awesome.css",
        "app/**/*.css"])
        .pipe(plugins.concat("all.min.css"))
        .pipe(plugins.csso())
        .pipe(gulp.dest("dist/css"));
});

gulp.task("html_replace", ["clean:dist"], function () {
    return gulp.src("app/**/*.html")
        .pipe(plugins.htmlReplace({
            "css": "/css/all.min.css",
            "js": "/js/all.min.js",
            "vendor": "/js/vendor.min.js"
        }))
        .pipe(gulp.dest("dist"));
});

gulp.task("deploy:public", ["build"], function () {
    return gulp.src(["dist/*.*", "dist/css/*", "dist/js/*", "dist/fonts/*", "!dist/*.html"], { base: "dist"})
        .pipe(plugins.replace(/https:\/\/localhost:8000/g, ""))
        .pipe(gulp.dest("../gymassistant/public"));
});

gulp.task("deploy:views", ["build"], function () {
    return gulp.src(["dist/**/*.html"], { base: "dist"})
        .pipe(gulp.dest("../gymassistant/views"));
});

gulp.task('templates', function(){
    gulp.src(['file.txt'])
        .pipe(replace(/foo(.{3})/g, '$1foo'))
        .pipe(gulp.dest('build/file.txt'));
});

gulp.task("default", ["build"]);

gulp.task("copy", ["clean:dist", "copy:static", "copy:fonts"]);

gulp.task("build", ["clean:dist", "copy", "css", "vendor", "js", "html_replace"]);

gulp.task("deploy", ["build", "deploy:public", "deploy:views"]);