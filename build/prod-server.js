require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var path = require('path')
var express = require('express')

// default port where server listens for incoming traffic
var port = 9009
// Define HTTP proxies to your custom API backend

var app = express()

// serve pure static assets
var staticPath = path.posix.join(config.build.assetsPublicPath, config.build.assetsSubDirectory)
app.use(express.static(config.build.assetsRoot))

app.use('*',  function (req, res) {
    res.sendFile(config.build.index)
})

var uri = 'http://localhost:' + port

console.log('> Starting server...')
console.log('> Listening at ' + uri + '\n')

var server = app.listen(port)
