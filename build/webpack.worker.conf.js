const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const fs = require('fs')
const utils = require('./utils')
const baseWebpackConfig = require('./webpack.base.conf')
const config = require('../config')

// location of where to generate the distribution bundle
const distDir = path.resolve('./static')

var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

module.exports =  merge(baseWebpackConfig, {
	// we're running this from node, not a browser
	target: 'web',
	// pull in all our test source files into the bundle
	entry: './src/lib/session/worker.js',
	output: {
		// location of the output directory
		path: distDir,
		// the resulting built file will be in dist/bundle.js
		filename: 'worker.js',
    libraryTarget: 'var'
	},
	resolve: {
		// only compile js and vue file extensions
		extensions: ['.js', '.json'],
		alias: {
      '@': utils.resolve('src')
		}
	},
	plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    })
    ]
})
