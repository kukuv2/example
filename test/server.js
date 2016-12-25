var path = require('path')
var fs = require('fs')
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
var staticPath = '../dist/static'
app.use('/static', express.static('../dist/static'))
// 路由
app.get('/:viewname?', function(req, res, next) {

    var viewname = req.params.viewname
        ? req.params.viewname + '.html'
        : 'index.html';

    var filepath = path.join('../dist', viewname);

    // 使用webpack提供的outputFileSystem
    fs.readFile(filepath, function(err, result) {
        if (err) {
            // something error
            return next(err);
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
    });
});


module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    var uri = 'http://localhost:' + port
    console.log('Listening at ' + uri + '\n')
})

