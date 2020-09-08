# lhr-gulp-cli

[![NPM Downloads][downloads-image]][downloads-url]
[![NPM Version][version-image]][version-url]
[![License][license-image]][license-url]
[![Dependency Status][dependency-image]][dependency-url]
[![devDependency Status][devdependency-image]][devdependency-url]
[![Code Style][style-image]][style-url]

> a gulp cli

## Installation

```shell
$ npm install lhr-gulp-cli

# or yarn
$ yarn add lhr-gulp-cli
```

## Usage

<!-- TODO: Introduction of API use -->

```javascript
const lhrGulpCli = require('lhr-gulp-cli')
"dev": "cross-env NODE_ENV=dev gulp dev",
"build": "cross-env NODE_ENV=prod gulp build",
"serve": "http-server dist -p 3001"
```

## 说明
- 这是一款使用gulp打包的html+css+js+image简单项目的自动化构建工作流
- 集压缩、按需合并代码和资源文件的功能，可在开发阶段与生产阶段使用。
- 指出html 文件使用  ##include('../include/base.html') 的形式include其他的html文件
- 开发阶段使用browser-sync开启开发服务器，支持热重载。打包的文件名为serve
- 生产阶段打包的最终文件名为 dist文件。但是在生产打包的过程使用了一些中间包作为临时目录，临时目录文件名有：'dist', 'temp', 'rev', 'temp_build', 支持打包的文件加上hash值，解决浏览器缓存问题。
- 使用此脚手架完成项目的构建需要项目支持目录
  1. views --> *.html
  2. css --> *.css
  3. js --> *.js 
          --> lib
                *.js
  4. images --> \*.\*
  5. include --> *.html
  7. 一些不需要打包的，最后会被打包到根目录下的文件，放到public目录中。比如index.html
- 虽然本项目使用gulp打包，但是无需添加gulpfile.js， 开箱即用。
- 后续会使用外部约定的js文件(例如gulp.config.js) 重写这些目录，达到抽象文件路径的功能。解耦合，灵活性更高。
- 后续会增加其他模块的打包方式
- 注意html文件中的路径问题


## 0.4.0版本更新说明
- 允许对文件夹目录使用配置文件进行配置, 类似于`vue.config.js`。 
- 本项目约定的配置文件的名称是`gulp.config.js`


## Contributing

1. **Fork** it on GitHub!
2. **Clone** the fork to your own machine.
3. **Checkout** your feature branch: `git checkout -b my-awesome-feature`
4. **Commit** your changes to your own branch: `git commit -am 'Add some feature'`
5. **Push** your work back up to your fork: `git push -u origin my-awesome-feature`
6. Submit a **Pull Request** so that we can review your changes.

> **NOTE**: Be sure to merge the latest from "upstream" before making a pull request!

## License

[MIT](LICENSE) &copy; freeany <812974019@qq.com>



[downloads-image]: https://img.shields.io/npm/dm/lhr-gulp-cli.svg
[downloads-url]: https://npmjs.org/package/lhr-gulp-cli
[version-image]: https://img.shields.io/npm/v/lhr-gulp-cli.svg
[version-url]: https://npmjs.org/package/lhr-gulp-cli
[license-image]: https://img.shields.io/github/license/freenay/lhr-gulp-cli.svg
[license-url]: https://github.com/freenay/lhr-gulp-cli/blob/master/LICENSE
[dependency-image]: https://img.shields.io/david/freenay/lhr-gulp-cli.svg
[dependency-url]: https://david-dm.org/freenay/lhr-gulp-cli
[devdependency-image]: https://img.shields.io/david/dev/freenay/lhr-gulp-cli.svg
[devdependency-url]: https://david-dm.org/freenay/lhr-gulp-cli?type=dev
[style-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[style-url]: https://standardjs.com
