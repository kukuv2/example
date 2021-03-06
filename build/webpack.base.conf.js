var path = require('path')
var config = require(path.join('../', 'config/index'))
var projectRoot = config.common.projectPath
var componentsPath = path.join(projectRoot, 'src/components')
var commonComponentsPath = path.join(componentsPath, '/commonComponents/index.js')
var utils = require('./utils')
const fs = require('fs')

var env = process.env.NODE_ENV
// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

module.exports = {
    // entry:entries ,
    output: {
        path: config.build.assetsRoot,
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename: '[name].js'
    },
    externals: {
        jquery: 'window.$'
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        fallback: [path.join(__dirname, path.join(projectRoot, 'node_modules'))],
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'src': path.resolve(__dirname, path.join(projectRoot, 'src')),
            'assets': path.resolve(__dirname, path.join(projectRoot, 'src/assets')),
            'components': path.resolve(__dirname, componentsPath),
            'bComponents': path.resolve(__dirname, path.join(projectRoot, 'src/components/bComponents'))
        }
    },
    resolveLoader: {
        fallback: [path.join(__dirname, path.join(projectRoot, 'node_modules'))]
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                include: projectRoot,
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    vue: {
        loaders: utils.cssLoaders({sourceMap: useCssSourceMap}),
        postcss: [
            require('autoprefixer')({
                    browsers: ['last 2 versions']
                }
            )
        ]
    }
}
