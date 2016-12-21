var config = require('../config/index')
var webpack = require('webpack')
var merge = require('webpack-merge')
var path = require('path')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf.js')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var pagesPath = path.join('./', '/src/pages')
var devModule = process.argv[2];
var devPath = path.join(pagesPath, devModule)

// add hot-reload related code to entry chunks
/*Object.keys(baseWebpackConfig.entry).forEach(function (name) {
 baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
 }
 )*/

module.exports = merge(baseWebpackConfig, {
        entry: {
            [devModule]: ['./build/dev-client', path.join(devPath, '/main.js')]
        },
        module: {
            loaders: utils.styleLoaders({sourceMap: config.dev.cssSourceMap})
        },
        // eval-source-map is faster for development
        devtool: '#source-map',
        plugins: [
            new webpack.DefinePlugin({
                    'process.env': config.dev.env
                }
            ),
            // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
            // https://github.com/ampedandwired/html-webpack-plugin
            new HtmlWebpackPlugin({
                    filename: 'index.html',
                    template: './src/pages/' + devModule + '/index.html',
                    inject: true,
                    chunks: [devModule]
                }
            ),
        ]
    }
)
