var gulp = require('gulp'),

    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    tsify = require('tsify'),
    sourcemaps = require('gulp-sourcemaps'),
    buffer = require('vinyl-buffer'),
    watchify = require("watchify"),
    gutil = require("gulp-util"),
    uglify = require('gulp-uglify'),


    pug = require('gulp-pug'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),

    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,

    clean = require('gulp-clean');

// source and distribution folder
var
    src = 'app/',
    dest = 'dist/';

// GULP TASKS
gulp.task('fonts', fontsCompile);
gulp.task('sass', ['fonts'], sassCompile);
gulp.task('pug', pugCompile);
gulp.task('ts', tsCompile);
gulp.task('clean', cleanDist);
gulp.task('images', imagesCompile);
gulp.task('browser-sync', ['sass', 'pug', 'ts', 'images'], browserSynOpts);
gulp.task('watch', watch);

gulp.task('default', ['clean'], function () {
    gulp.start(['watch', 'browser-sync']);
});



// SASS
var _sass = {
    in: src + 'index.sass',
    out: dest + 'css/',
    watch: src + '**/*.sass',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true,
        includePaths: 'assets/stylesheets'
    }
};

function sassCompile() {
    return gulp.src(_sass.in)
        .pipe(sass(_sass.sassOpts).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(_sass.out))
        .pipe(browserSync.reload({ stream: true }));
}

// PUG
var _pug = {
    in: src + 'index.pug',
    out: dest,
    watch: src + '**/*.pug'
};

function pugCompile() {
    return gulp.src(_pug.in)
        .pipe(pug())
        .pipe(gulp.dest(_pug.out))
        .pipe(browserSync.reload({ stream: true }));
}


// TS
var watchedBrowserify = watchify(
    browserify({
        basedir: '.',
        debug: true,
        entries: ['app/index.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
);

function tsCompile() {
    return watchedBrowserify
        // .transform('babelify', {
        //     presets: ['es2015'],
        //     extensions: ['.ts']
        // })
        .bundle()
        .pipe(source('js/index.js'))
        // .pipe(buffer())
        // .pipe(sourcemaps.init({ loadMaps: true }))
        // .pipe(uglify())
        // .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dest))
        .pipe(browserSync.reload({ stream: true }));
}
watchedBrowserify.on("update", tsCompile);
watchedBrowserify.on("log", gutil.log);
watchedBrowserify.on("error", gutil.log);


// Fonts
var fonts = {
    in: src + 'assets/fonts/**/*.{eot,woff,ttf,svg,otf}',
    out: dest + 'fonts/'
};

function fontsCompile() {
    return gulp
        .src(fonts.in)
        .pipe(gulp.dest(fonts.out));
}

// Images
var _img = {
    in: src + 'assets/**/*.{png,gif,jpg}',
    out: dest + 'assets/'
};

function imagesCompile() {
    return gulp.src(_img.in)
        .pipe(gulp.dest(_img.out));
}

// browser-sync
function browserSynOpts() {
    return browserSync.init({
        server: {
            baseDir: dest
        },
        notify: false
    });
}

// browser-sync
function cleanDist() {
    return gulp.src(dest, { read: false })
        .pipe(clean());
}

// watching
function watch() {
    gulp.watch(_sass.watch, ['sass']);
    gulp.watch(_pug.watch, ['pug']);
    gulp.watch(_pug.watch, ['ts']);
}