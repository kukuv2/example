var path = require('path')
var express = require('express')

// default port where dev server listens for incoming traffic
var port = '8083'
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware

var app = express()


// proxy api requests

// handle fallback for HTML5 history API
// app.use(require('connect-history-api-fallback')())

// serve pure static assets
var staticPath = '../dist/static/'
app.use(staticPath, express.static('./static'))

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    var uri = 'http://localhost:' + port
    console.log('Listening at ' + uri + '\n')
})

