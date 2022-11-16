"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const babel = require('gulp-babel');
const header = require("gulp-header");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require('sass'));
const uglify = require("gulp-uglify");
const nunjucks = require('gulp-nunjucks');
const filter = require('gulp-filter');


// BrowserSync
function browserSyncStart(done) {
  browsersync.init({
    server: {
      baseDir: "dist/"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(["./vendor/"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Bootstrap
  var bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('dist/vendor/bootstrap'));
  // Font Awesome CSS
  var fontAwesomeCSS = gulp.src('./node_modules/@fortawesome/fontawesome-free/css/**/*')
    .pipe(gulp.dest('dist/vendor/fontawesome-free/css'));
  // Font Awesome Webfonts
  var fontAwesomeWebfonts = gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/**/*')
    .pipe(gulp.dest('dist/vendor/fontawesome-free/webfonts'));
  // jQuery Easing
  /*
  var jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
    .pipe(gulp.dest('dist/vendor/jquery-easing'));
  */
  // jQuery
  var jquery = gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('dist/vendor/jquery'));
  return merge(bootstrap, fontAwesomeCSS, fontAwesomeWebfonts, jquery);//, jqueryEasing);
}

// CSS task
function css() {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest("dist/css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist/css"))
    .pipe(browsersync.stream());
}

// JS task
function js() {
  return gulp
    .src([
      './js/*.js',
      '!./js/*.min.js',
      '!./js/contact_me.js',
      '!./js/jqBootstrapValidation.js'
    ])
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe(browsersync.stream());
}

const nunjucksOptions = {
  tags: {
    blockStart: '<%',
    blockEnd: '%>',
    variableStart: '<$',
    variableEnd: '$>',
    commentStart: '<#',
    commentEnd: '#>'
  }
};

function htmlProd() {
  const f = filter(['**', '!**/index.html', '!holiday/*.html'], {restore: true});
  return gulp
    .src(["./nunjucks/**/*.html", "!./nunjucks/partials/**", "!./nunjucks/attic/**"])
    .pipe(nunjucks.compile({production: true}, nunjucksOptions))
    .pipe(f)
    .pipe(rename(function(path) {
      path.dirname += "/" + path.basename;
      path.basename = "index";
    }))
    .pipe(f.restore)
    .pipe(gulp.dest('dist/'));
}

function htmlDev() {
  const f = filter(['**', '!**/index.html', '!holiday/*.html'], {restore: true});
  return gulp
    .src(["./nunjucks/**/*.html", "!./nunjucks/partials/**", "!./nunjucks/attic/**"])
    .pipe(nunjucks.compile({production: false}, nunjucksOptions))
    .pipe(f)
    .pipe(rename(function(path) {
      path.dirname += "/" + path.basename;
      path.basename = "index";
    }))
    .pipe(f.restore)
    .pipe(gulp.dest('dist/'));
}

function staticFiles() {
  return gulp
    .src("./static/**/*")
    .pipe(gulp.dest("dist/"));
}



// Watch files
function watchFiles() {
  gulp.watch("./scss/**/*", css);
  gulp.watch(["./js/**/*", "!./js/**/*.min.js"], js);
  gulp.watch("./nunjucks/**/*.html", htmlDev);
  gulp.watch("./**/*.html", browserSyncReload);
}

// Define complex tasks
const vendor = gulp.series(clean, modules);
const buildProd = gulp.series(vendor, gulp.parallel(css, js, htmlProd, staticFiles));
const buildDev = gulp.series(vendor, gulp.parallel(css, js, htmlDev, staticFiles));
const watch = gulp.series(buildDev, gulp.parallel(watchFiles, browserSyncStart));

// Export tasks
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.vendor = vendor;
exports.buildDev = buildDev;
exports.build =  buildProd;
exports.htmlProd = htmlProd;
exports.htmlDev = htmlDev;
exports.watch = watch;
exports.default = buildProd;
