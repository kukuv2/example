var path = require('path')
var fs = require('fs')
var config = require('../config/index')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf.js')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var env = config.build.env
var pagesPath = path.join('./', '/src/pages')
var componentsPath = path.join('./', 'src/components')
var commonComponentsPath = path.join(componentsPath, '/commonComponents/index.js')
var entries = fs.readdirSync(pagesPath).reduce((entries, dir) => {
        const fullDir = path.join(pagesPath, dir)
        const entry = path.join(fullDir, 'main.js')
        if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
            entries[dir] = [entry]
        }

        return entries
    }, {}
)
Object.assign(entries, {
        'commonComponents': [commonComponentsPath]
    }
)
var webpackConfig = merge(baseWebpackConfig, {
        entry: entries,
        module: {
            loaders: utils.styleLoaders({
                    sourceMap: config.build.productionSourceMap,
                    extract: true
                }
            )
        },
        // devtool: config.build.productionSourceMap ? '#source-map' : false,
        output: {
            path: config.build.assetsRoot,
            filename: utils.assetsPath('js/[name].[chunkhash].js'),
            chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
        },
        vue: {
            loaders: utils.cssLoaders({
                    sourceMap: config.build.productionSourceMap,
                    extract: true
                }
            )
        },
        plugins: [
            // http://vuejs.github.io/vue-loader/en/workflow/production.html
            new webpack.DefinePlugin({
                    'process.env': env
                }
            ),
            /*new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                }
            ),*/
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(),
            // extract css into its own file
            new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css')),
            // generate dist index.html with correct asset hash for caching.
            // you can customize output by editing /index.html
            // see https://github.com/ampedandwired/html-webpack-plugin
            // split vendor js into its own file
            new webpack.optimize.CommonsChunkPlugin({
                    name: 'vendor',
                    minChunks: function (module, count) {
                        // any required modules inside node_modules are extracted to vendor
                        return (
                            module.resource &&
                            /\.js$/.test(module.resource) &&
                            module.resource.indexOf(
                                path.join(__dirname, '../node_modules')
                            ) === 0
                        )
                    }
                }
            ),
            // extract webpack runtime and module manifest to its own file in order to
            // prevent vendor hash from being updated whenever app bundle is updated
            new webpack.optimize.CommonsChunkPlugin({
                    name: 'manifest',
                    chunks: ['vendor']
                }
            ),
            new HtmlWebpackPlugin({
                    filename: path.resolve(__dirname, '../dist/admin.html'),
                    template: './src/pages/admin/index.html',
                    inject: true,
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true
                        // more options:
                        // https://github.com/kangax/html-minifier#options-quick-reference
                    },
                    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
                    chunksSortMode: 'dependency',
                    chunks:['manifest','vendor','commonComponents','admin']
                }
            ),
            new HtmlWebpackPlugin({
                    filename: path.resolve(__dirname, '../dist/front.html'),
                    template: './src/pages/front/index.html',
                    inject: true,
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true
                        // more options:
                        // https://github.com/kangax/html-minifier#options-quick-reference
                    },
                    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
                    chunksSortMode: 'dependency',
                    chunks:['manifest','vendor','commonComponents','front']
                }
            ),
        ]
    }
)

if (config.build.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
                asset: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp(
                    '\\.(' +
                    config.build.productionGzipExtensions.join('|') +
                    ')$'
                ),
                threshold: 10240,
                minRatio: 0.8
            }
        )
    )
}

module.exports = webpackConfig
