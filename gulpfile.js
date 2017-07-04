// Gulp.js configuration
var
    // modules
    gulp = require('gulp')
    devBuild = (process.env.NODE_ENV !== 'production'),
    sass = require('node-sass');

    // folders
    folder = {
        src: 'resources/',
        build: 'build/'
    };
