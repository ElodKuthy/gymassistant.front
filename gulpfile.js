"use strict";

var gulp = require("gulp");
var del = require("del");
var plugins = require("gulp-load-plugins")();
var config = require('./config.json');

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
            https: {
                key: "ssl/key.pem",
                cert: "ssl/cert.pem"
            },
            port: 8001,
            proxies: [{
                source: "/bower_components",
                target: "http://localhost:8002/"
            }]
        }));
});

gulp.task("run:dist", function () {
    return gulp.src("dist")
        .pipe(plugins.webserver({
            fallback: "index.html",
            https: {
                key: "ssl/key.pem",
                cert: "ssl/cert.pem"
            },
            port: 8001
        }));
});

gulp.task("clean:dist", function (cb) {
    return del("dist", cb);
});

gulp.task("copy:static", ["clean:dist"], function () {
    return gulp.src(["app/*.png", "app/favicon.ico"], {
            base: "app"
        })
        .pipe(gulp.dest("dist"));
});

gulp.task("copy:fonts", ["clean:dist"], function () {
    return gulp.src("bower_components/fontawesome/fonts/*.*")
        .pipe(gulp.dest("dist/fonts"));
});

gulp.task("css:vendor", ["clean:dist"], function () {
    return gulp.src([
            "bower_components/bootstrap/dist/css/bootstrap.min.css",
            "bower_components/bootstrap/dist/css/bootstrap-theme.min.css",
            "bower_components/fontawesome/css/font-awesome.min.css"
        ])
        .pipe(plugins.concat("vendor.min.css"))
        .pipe(gulp.dest("dist/css"));
});

gulp.task("css:all", ["clean:dist"], function () {
    return gulp.src("app/**/*.css")
        .pipe(plugins.concat("all.min.css"))
        .pipe(plugins.csso())
        .pipe(gulp.dest("dist/css"));
});

gulp.task("js:modernizr", ["clean:dist"], function () {
    return gulp.src("bower_components/modernizr/modernizr.js")
        .pipe(gulp.dest("dist/js"));
});

gulp.task("js:vendor", ["clean:dist"], function () {
    return gulp.src([
            "bower_components/jquery/dist/jquery.min.js",
            "bower_components/bootstrap/dist/js/bootstrap.min.js",
            "bower_components/angular/angular.min.js",
            "bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js",
            "bower_components/angular-animate/angular-animate.min.js",
            "bower_components/angular-i18n/angular-locale_hu-hu.js",
            "bower_components/angular-route/angular-route.min.js",
            "bower_components/angular-resource/angular-resource.min.js",
            "bower_components/moment/min/moment.min.js",
            "bower_components/angular-moment/angular-moment.min.js",
            "bower_components/angular-cookie/angular-cookie.min.js",
            "bower_components/qcode-decoder/build/qrcode.js",
            "bower_components/qrcode/lib/qrcode.min.js",
            "bower_components/angular-qr/angular-qr.min.js",
            "bower_components/angular-sanitize/angular-sanitize.min.js",
            "bower_components/ng-csv/build/ng-csv.min.js"
        ])
        .pipe(plugins.concat("vendor.min.js"))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("js:all", ["clean:dist"], function () {
    return gulp.src(["app/**/*.module.js", "app/**/*.js"])
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.concat("all.min.js"))
        .pipe(plugins.uglify())
        .pipe(gulp.dest("dist/js"));
});

gulp.task("html_replace", ["clean:dist"], function () {
    return gulp.src("app/**/*.html")
        .pipe(plugins.htmlReplace({
            "css_vendor": "/css/vendor.min.css",
            "css_all": "/css/all.min.css",
            "js_vendor": "/js/vendor.min.js",
            "js_modernizr": "/js/modernizr.js",
            "js_all": "/js/all.min.js"
        }))
        .pipe(gulp.dest("dist"));
});

gulp.task("deploy:public", ["build"], function () {
    return gulp.src(["dist/*.*", "dist/css/*", "dist/fonts/*", "!dist/*.html"], {
            base: "dist"
        })
        .pipe(gulp.dest(config.deploy.target + "/public"));
});

gulp.task("deploy:js", ["build"], function () {
    return gulp.src(["dist/js/*"], {
            base: "dist"
        })
        .pipe(plugins.replace(/https:\/\/localhost:8000/g, ""))
        .pipe(gulp.dest(config.deploy.target + "/public"));
});

gulp.task("deploy:views", ["build"], function () {
    return gulp.src(["dist/**/*.html"], {
            base: "dist"
        })
        .pipe(gulp.dest(config.deploy.target + "/views"));
});

gulp.task("default", ["deploy"]);

gulp.task("copy", ["clean:dist", "copy:static", "copy:fonts"]);

gulp.task("css", ["clean:dist", "css:vendor", "css:all"]);

gulp.task("js", ["clean:dist", "js:modernizr", "js:vendor", "js:all"]);

gulp.task("build", ["clean:dist", "copy", "css", "js", "html_replace"]);

gulp.task("deploy", ["build", "deploy:public", "deploy:js", "deploy:views"]);