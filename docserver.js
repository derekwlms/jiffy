/*
 * Serve up ngdocs pages for proper display in a web browser.
 * Run under node.js:  node docserver.js
 * http://localhost:3000/docs
 */

var express = require('express');
var serveStatic = require('serve-static');

var app = express();
app.use('/docs', serveStatic('docs'));
app.listen(process.env.PORT || 3000);