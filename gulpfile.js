var gulp = require('gulp');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var rev = require('gulp-rev-append');
var connect = require('gulp-connect');
var replace = require('gulp-replace');
var argv = require('yargs').argv;
var fs = require("fs");


var CSS_LIB = [
    'bower_components/angular-xeditable/dist/css/xeditable.css',
    'bower_components/angular-material/angular-material.css'
];

var CSS_APP = [
    'css/main.css'
];

var JS_LIB = [
    'bower_components/angular/angular.js',
    'bower_components/angular-cookies/angular-cookies.js',
    'bower_components/angular-resource/angular-resource.min.js',
    'bower_components/angular-sanitize/angular-sanitize.min.js',
    'bower_components/angular-translate/angular-translate.min.js',
    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
    'bower_components/angular-xeditable/dist/js/xeditable.min.js',
    'bower_components/momentjs/moment.js',
    'bower_components/angular-aria/angular-aria.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-material/angular-material.js',
    'bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js',
    'bower_components/sockjs/sockjs.js',
    'bower_components/stomp-websocket/lib/stomp.js'
];

var JS_APP = [
    'app/**/**.js'
];


/**
*   The location of the resources for deploy
*/
var DESTINATION = 'dest/';
/**
* The single page initial html file. It will be altered 
* by this script.
*/
var INDEX_FILE = 'index.html';
/**
* The name of the angular module
*/
var MODULE_NAME = 'scrum-board-frontend';
/**
* The URL of the back-end API
*/

var BACKEND = argv.backend || 'http://localhost:8080';

var API_URL = BACKEND + '/api';
var LOGIN_URL = BACKEND + '/auth';
/**
* Route to which the API calls will be mapped 
*/
var API_ROUTE = '/api';
var LOGIN_ROUTE = '/auth';

/**
* Task for concatenation of the js libraries used 
* in this project 
*/
gulp.task('concat_js_lib', function () {
    return gulp.src(JS_LIB) // which js files
        .pipe(concat('lib.js')) // concatenate them in lib.js
        .pipe(gulp.dest(DESTINATION)); // save lib.js in the DESTINATION folder
});

/**
* Task for concatenation of the css libraries used 
* in this project 
*/
gulp.task('concat_css_lib', function () {
    return gulp.src(CSS_LIB) // which css files
        .pipe(concat('lib.css')) // concat them in lib.css
        .pipe(gulp.dest(DESTINATION)); // save lib.css in the DESTINATION folder
});

/**
* Task for concatenation of the js code defined  
* in this project 
*/
gulp.task('concat_js_app', function () {
    return gulp.src(JS_APP)
        .pipe(concat('src.js'))
        .pipe(replace('$$BACKEND$$', BACKEND))
        .pipe(gulp.dest(DESTINATION))
});

/**
* Task for concatenation of the css code defined 
* in this project 
*/
gulp.task('concat_css_app', function () {
    return gulp.src(CSS_APP)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(DESTINATION))
});

/**
* Task for concatenation of the html templates defined 
* in this project 
*/
gulp.task('templates', function () {
    return gulp.src('views/**/**.html') // which html files
        .pipe(
            templateCache('templates.js', { // compile them as angular templates 
                module: MODULE_NAME,        // from module MODULE_NAME 
                root: 'app'                 // of the app
            })) 
        .pipe(gulp.dest(DESTINATION));
});

/**
* Task for adding the revision as parameter   
* for cache braking
*/
gulp.task('cache-break', function () {
    return gulp.src(INDEX_FILE) // use the INDEX_FILE as source
        .pipe(rev())            // append the revision to all resources
        .pipe(gulp.dest('.'))   // save the modified file at the same destination
        .pipe(connect.reload());// reload
});

var tasks = [
    'concat_js_lib',
    'concat_css_lib',
    'concat_js_app',
    'concat_css_app',
    'templates'
];

gulp.task('build', tasks, function () {
    gulp.start('cache-break');
});

gulp.task('watch', function () {
    gulp.watch('app/**/**.js', ['concat_js_app', 'cache-break']);
    gulp.watch('views/**/**.html', ['templates', 'cache-break']);
    gulp.watch('css/**/**.css', ['concat_css_app', 'cache-break']);
});

gulp.task('serve', function () {
    connect.server({
        port: argv.port || 8000,
        livereload: typeof argv.livereload === 'undefined' || argv.livereload === 'true',
        middleware: function (connect, opt) {
            return [
                (function () {
                    var url = require('url');
                    var proxy = require('proxy-middleware');
                    var options = url.parse(API_URL);
                    options.route = API_ROUTE;
                    return proxy(options);
                })(),
                (function () {
                    var url = require('url');
                    var proxy = require('proxy-middleware');
                    var options = url.parse(LOGIN_URL);
                    options.route = LOGIN_ROUTE;
                    return proxy(options);
                })()
            ];
        }
    });
});

gulp.task('default', ['build', 'serve', 'watch']);
