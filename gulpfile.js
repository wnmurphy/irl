var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var html = require('gulp-html-replace');
var sass = require('gulp-sass');
var iife = require('gulp-iife');

var path = {
  all: [
    'client/*.js',
    'client/index.html',
    'client/*.jsx',
    'client/**/*.js',
    'client/**/*.jsx',
    'client/**/*.scss',
    '!client/dist/*.js',
    '!client/dist/*.html',
    '!client/dist/*.jsx',
    '!client/dist/**/*.js',
    '!client/dist/**/*.html',
    '!client/dist/**/*.jsx',
    '!client/lib/**/*.js'
  ],
  js: [
    'client/*.js',
    'client/*.jsx',
    'client/**/*.js',
    'client/**/*.jsx',
    '!client/dist/*.js',
    '!client/dist/*.jsx',
    '!client/dist/**/*.js',
    '!client/dist/**/*.jsx',
    '!client/lib/**/*.js'
  ],
  concat: [
    'client/controllers/MapController.js',
    'client/controllers/TimeController.js',
    'client/controllers/LocationController.js',
    'client/controllers/AuthController.js',
    'client/controllers/ProfileController.js',
    'client/controllers/FeedController.js',
    'client/controllers/MetaController.js',
    'client/controllers/SaveSpotController.js',
    'client/dist/src/components/Toast.js',
    'client/dist/src/components/ChatCard.js',
    'client/dist/src/components/DirectionsLink.js',
    'client/dist/src/views/ScreenSizeWarning.js',
    'client/dist/src/views/SpotView.js',
    'client/dist/src/views/MapView.js',
    'client/dist/src/views/FeedView.js',
    'client/dist/src/views/ProfileView.js',
    'client/dist/src/views/SearchView.js',
    'client/dist/src/views/CreateView.js',
    'client/dist/src/components/NavBar.js',
    'client/dist/src/components/ShareCard.js',
    'client/dist/src/components/LoginCard.js',
    'client/dist/src/app.js'
  ],

  testjsx: [
    'tests/*.jsx'
  ],

  html: [
    'client/index.html'
  ],
  minified_out: 'min.js',
  dest_src: 'client/dist/src',
  dest_build: 'client/dist/build',
  dest: 'client/dist'
};

gulp.task('transform', function() {
  gulp.src(path.js)
  .pipe(react())
  .pipe(gulp.dest(path.dest_src));
});

gulp.task('test', function() {
  gulp.src(path.testjsx)
  .pipe(react())
  .pipe(gulp.dest('tests/'));
});

gulp.task('styles', function() {
    gulp.src('client/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('client/dist/'))
});

gulp.task('watch', function() {
  gulp.watch(path.all, ['transform', 'styles']);
});

gulp.task('watchtests', function() {
  gulp.watch(path.testjsx, ['test']);
});

gulp.task('default', ['watch', 'watchtests']);

gulp.task('build', function() {
  gulp.src(path.concat)
  .pipe(react())
  .pipe(concat(path.minified_out))
  // .pipe(uglify())
  .pipe(iife({
    params: ['window', 'document', '$', 'React', 'ReactoRouter', 'History'],
    args:['window', 'document', 'window.$','window.React', 'window.ReactRouter', 'window.History']
  }))
  .pipe(gulp.dest(path.dest_build));
});

gulp.task('replacehtml', function() {
  gulp.src(path.html)
  .pipe(html({'js': 'build/' + path.minified_out}))
  .pipe(gulp.dest(path.dest));
});

gulp.task('buildTest', ['transform', 'test']);

gulp.task('production', ['transform', 'build']);
