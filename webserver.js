/*
 * Serve up app and ngdocs pages for proper display in a web browser.
 * Run under node.js:  node webserver.js.
 * http://localhost
 */

var express = require('express');
var serveStatic = require('serve-static');

var path = __dirname + '/';
var port = process.env.PORT || 80;
var suffix = port === 80 ? '' : ':' + port;

var app = express();
app.use('/', serveStatic(path + '/'));
app.use('/app/bower_components/', serveStatic(path + '/bower_components/'));

console.log('Serving files from ', path);
console.log('Web server started.  Visit http://localhost' 
                + suffix + ' or http://localhost' + suffix + '/app');

app.listen(port);