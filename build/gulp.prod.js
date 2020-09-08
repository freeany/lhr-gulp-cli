
const { src, dest, parallel, series } = require('gulp')

const uglify = require('gulp-uglify')
const Less = require('gulp-less')
const Autoprefixer = require('gulp-autoprefixer')// 浏览器前缀
// html
const htmlmin = require("gulp-htmlmin")
const FileInclude = require('gulp-file-include') // 文件模块化
// image
const Imagemin = require('gulp-imagemin')

const cleanCss = require('gulp-clean-css')
// const rename = require('gulp-rename')
const babel = require('gulp-babel')
const gulpIf = require('gulp-if')
const rev = require('gulp-rev')  // css/js/image加hash
const revCollector = require('gulp-rev-collector')

// 清理目录
const del = require('del')
const gulpUseref = require('gulp-useref')

const config = require('./config')
const { y_views, y_less, y_css, y_js, y_dist, y_src, y_public, y_images, y_font, y_temp, y_rev, y_temp_build } = config

const clean = () => {
    return del([y_dist, y_temp, y_rev, y_temp_build])
}

const cleanOther = () => {
    return del([y_temp, y_rev, y_temp_build])
}

// html
function html () {
    return src(`${y_src}/${y_views}/*.html`, { base: y_src })
        .pipe(FileInclude({ // HTML模板替换，具体用法见下文
            prefix: '##',
            basepath: '@file'
        }))
        .on('error', function (err) {
            console.error('Task:copy-html,', err.message);
            this.end();
        })
        .pipe(dest(y_temp))
}

function css () {
    return src(`${y_src}/${y_css}/*.css`, { base: y_src })
        .pipe(Autoprefixer({
            overrideBrowserslist: ['last 2 versions', 'Android >= 4.0'],
            cascade: true,
            remove: false
        }))
        .pipe(dest(y_temp))
}

// css
function less () {
    return src(`${y_src}/${y_less}/*.less`, { base: y_src })
        .pipe(Less())       //编译less
        .pipe(Autoprefixer({
            overrideBrowserslist: ['last 2 versions', 'Android >= 4.0'],
            cascade: true,
            remove: false
        }))
        .pipe(dest(y_temp))
}

function js () {
    return src(`${y_src}/${y_js}/**`, { base: y_src })
        .pipe(babel({ presets: [require('@babel/preset-env')] }))
        .pipe(dest(y_temp))
}
// 将image打到temp文件夹中，然后加上hash打到dist文件夹下
function image () {
    return src(`${y_src}/${y_images}/**`, { base: y_src })
        .pipe(Imagemin())
        .pipe(dest(y_temp));
}
const font = () => {
    return src(`${y_src}/${y_font}/**`, { base: y_src })
        .pipe(Imagemin())
        .pipe(dest(y_dist))
}
// 直接打包到根目录下
function extra () {
    return src(`${y_public}/**`, { base: y_public })
        .pipe(dest(y_dist));
}

// 对文件进行合并压缩
const useref = () => {
    // 这里需要写temp/view*.html 定位到html文件去找注释
    return src(`${y_temp}/${y_views}/*.html`, { base: y_temp })
        .pipe(gulpUseref({ searchPath: [y_temp, '.'] }))
        .pipe(gulpIf(/\.js$/, uglify()))
        .pipe(gulpIf(/\.css$/, cleanCss()))
        .pipe(gulpIf(/\.html$/, htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true
        })))
        .pipe(dest(y_temp_build)) // 压缩后放到一个临时文件中。
}

// 对css和js文件添加hash
// 找到使用useref合并压缩后的文件， 然后打上hash放到dist文件中。
const cssRevHash = () => {
    return src(`${y_temp_build}/${y_css}/**/*.css`)
        .pipe(rev())
        .pipe(dest(`${y_dist}/${y_css}/`))
        .pipe(rev.manifest())
        .pipe(dest(`${y_rev}/${y_css}`));
}

const jsRevHash = () => {
    return src(`${y_temp_build}/${y_js}/**/*.js`)
        .pipe(rev())
        .pipe(dest(`${y_dist}/${y_js}/`))
        .pipe(rev.manifest())
        .pipe(dest(`${y_rev}/${y_js}`))
}
const imageRevHash = () => {
    return src(`${y_temp}/${y_images}/**`)
        .pipe(rev())
        .pipe(dest(`${y_dist}/${y_images}/`))
        .pipe(rev.manifest())
        .pipe(dest(`${y_rev}/${y_images}`))
}
// 对于html文件不打包，服务器配置 \.html& { add_header Last-Modified $date_gmt }, HTTP请求每次去检测文件新鲜度的时候，都让去请求一次服务器。
// const htmlRevHash = () => {
//     return src('temp_build/views/*.html')
//         .pipe(rev())
//         .pipe(dest('dist/views/'))
//         .pipe(rev.manifest())
//         .pipe(dest(`rev/html`));
// }

// 将文件名通过mainifest映射到temp_build/views/*.html中的静态资源中，然后将html打到dist/views文件夹中。
const injectHtmlRev = () => {
    return src([`${y_rev}/**/*.json`, `${y_temp_build}/${y_views}/*.html`])
        .pipe(revCollector({ replaceReved: true }))
        .pipe(dest(`${y_dist}/${y_views}/`));
}

const compiler = parallel(html, css, less, js)

const build = series(
    clean,
    parallel(
        series(compiler, useref, parallel(cssRevHash, jsRevHash, imageRevHash), injectHtmlRev),
        image,
        font,
        extra
    ),
    cleanOther  // 清除其他的目录
)
module.exports = {
    build
}
