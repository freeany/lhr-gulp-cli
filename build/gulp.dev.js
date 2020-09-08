const { src, dest, watch, parallel, series } = require('gulp')
// js
const babel = require('gulp-babel')
// const WebpackConfig = require('./webpack.config.js');
const Less = require('gulp-less');
const FileInclude = require('gulp-file-include'); // 文件模块化

// server
const bs = require('browser-sync').create()

// 配置文件
const config = require('./config');
const { y_views, y_less, y_css, y_js, y_serve, y_src, y_public, y_images } = config

// html，css， less， js
const html = () => {
    return src(`${y_src}/${y_views}/*.html`, { base: y_src })
        .pipe(FileInclude({ // HTML模板替换，具体用法见下文
            prefix: '##',
            basepath: '@file'
        })).on('error', function (err) {
            console.error('Task:copy-html,', err.message);
            this.end();
        })
        .pipe(dest(y_serve)) // 拷贝 
        .pipe(bs.reload({ stream: true }))  // 热重载 {stream: true} 可以执行多个文件
}

// less
const less = () => {
    return src(`${y_src}/${y_less}/*.less`, { base: y_src })
        .pipe(Less())
        .pipe(dest(y_serve))
        .pipe(bs.reload({ stream: true }))
}

const css = () => {
    return src(`${y_src}/${y_css}/*.css`, { base: y_src })
        .pipe(dest(y_serve)) //当前对应css文件
        .pipe(bs.reload({ stream: true }))
}
// const compilerJS = Webpack(WebpackConfig);

const js = () => {
    return src(`${y_src}/${y_js}/**`, { base: y_src })
        .pipe(babel({ presets: [require('@babel/preset-env')] }))
        .pipe(dest(y_serve)) // 拷贝
        .pipe(bs.reload({ stream: true }))
}
// 测试用例
// const test = (done) => {
// todo ....
//     done()
// }

const server = () => {
    watch(`${y_src}/${y_less}/*.less`, less)
    watch(`${y_src}/${y_css}/*.css`, css)
    watch(`${y_src}/${y_js}/*.js`, js)
    watch(`${y_src}/${y_views}/*.html`, html)
    watch([
        `${y_src}/${y_images}/**`,
        `${y_public}/**`
    ], async (done) => {
        await bs.reload()
        done()
    })
    bs.init({
        notify: false,
        port: 9909, //端口
        server: {
            // 开发阶段就不打包 images publi了，如果需要里面的资源，直接去src或public里面找
            // 'serve/views/'提供基础路径, 项目入口的index.html不在下面三个目录下面,所以新增一个'serve/views/'目录。
            baseDir: [y_serve, y_src, y_public, `${y_src}/${y_views}`],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}

const complier = parallel(html, less, css, js)
const develop = series(complier, server)
module.exports = {
    develop
}
