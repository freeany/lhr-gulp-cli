const cwd = process.cwd()
const path = require('path')

let config = {
    y_views: 'views',
    y_less: 'css',
    y_css: 'css',
    y_js: 'js',
    y_font: 'fonts',
    y_images: 'images',

    y_serve: 'serve',
    y_src: 'src',
    y_public: 'public',


    y_dist: 'dist/',
    y_temp: 'temp/',
    y_rev: 'rev/',
    y_temp_build: 'temp_build/'
}

try {
    const loadConfig = require(path.join(cwd, 'gulp.config.js'))
    config = Object.assign({}, config, loadConfig)
} catch (e) { }

module.exports = config
