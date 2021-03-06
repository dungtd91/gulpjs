'use strict';
var gulp              = require('gulp');
var gutil             = require('gulp-util');
var browserSync       = require('browser-sync');
var sass              = require('gulp-sass');
var autoprefixer      = require('gulp-autoprefixer');
var rename            = require('gulp-rename');
var imagemin          = require('gulp-imagemin');
var jade              = require('gulp-jade');
var harp              = require('harp');
var cssmin            = require('gulp-cssmin');
var rename            = require('gulp-rename');
var reload            = browserSync.reload;

gulp.task('default',['css','watch'], function(){
  gutil.log("Gulp is running");
});

gulp.task('server', function () {
  harp.server('./src', {
    port: 1212
  }, function () {
    browserSync({
      proxy: "localhost:1212",
      open: true,
      /* Hide the notification. It gets annoying */
      notify: {
        styles: ['opacity: 0', 'position: absolute']
      }
    });
    /**
     * Watch for scss changes, tell BrowserSync to refresh main.css
     */
    gulp.watch(["src/css/**/*.scss"], function () {
      reload("src/css/main.css", {stream: true});
    });
    /**
     * Watch for Jade file changes, reload the whole page
     */
    gulp.watch(["src/index.jade", "src/jade/**/*.jade"], function () {
      reload();
    });
    /**
     * Watch for Js file changes, reload the whole page
     */
    gulp.watch(["src/js/**/*.js"], function () {
      reload();
    });
  })
});

//Production Tasks

//Convert .jade to .html file
gulp.task('html', function(){
	gulp.src('src/*.jade')
	.pipe(jade({
		pretty: true
	}))
	.pipe(gulp.dest('dist/'));
});

//Convert .scss file to .css
gulp.task('css', function () {
  return gulp.src('./src/css/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/css'));
});

/*-----Copy Js files--------*/

gulp.task('js', function(){
	gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('dist/js/'));
});

/*-----Copy Images--------*/

gulp.task('img', function() {
    gulp.src('src/img/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

/*-----Copy Fonts--------*/

gulp.task('fonts', function(){
	gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts/'));
});

/*-----Gulp Task for Production--------*/

gulp.task('build',['html','css','img','fonts','js'], function(){
  console.log('Production work is almost done :)');
});
