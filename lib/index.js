// 根据环境引入不同的配置文件
let buildConfig;
if (process.env.NODE_ENV === 'dev') {
    buildConfig = require('../build/gulp.dev');
} else {
    buildConfig = require('../build/gulp.prod');
}


// build
if (process.env.NODE_ENV === 'dev') {
    const { develop } = buildConfig
    exports.dev = develop
} else {
    const { build } = buildConfig
    exports.build = build
}

