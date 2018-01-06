const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const fs = require('fs')
const utils = require('./utils')
const baseWebpackConfig = require('./webpack.base.conf')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

// location of where to generate the distribution bundle
const distDir = path.resolve('./dist');

// location where our tests are
const sourceTestDir = path.resolve('./test/unit/specs');

// location where our source (non test) are
const sourceDir = path.resolve('./src');

var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

module.exports =  merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
	},
	// we're running this from node, not a browser
	target: 'web',
	output: {
		// location of the output directory
		path: distDir,
		// the resulting built file will be in dist/bundle.js
		filename: 'bundle.js'
		// // we want webpack to give us a module.exports
	},
	resolve: {
		// only compile js and vue file extensions
		extensions: ['.js'],
		alias: {
      '@': utils.resolve('src')
		}
	},
	plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    })
    ]
})
