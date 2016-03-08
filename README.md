# Jiffy - JavaScript File Editor
[![Build Status](https://secure.travis-ci.org/derekwlms/jiffy.png?branch=master)](https://travis-ci.org/derekwlms/jiffy)

![Jiffy](http://paymenthorizons.com/jiffyfiles/jiffy-med.png)

> **You've got flat files?  That's understandable.**

Jiffy is a flat file editor written in JavaScript.  It's a quick, easy way to view and edit your data files using only a browser. 

Jiffy uses the [JavaScript File API](https://www.w3.org/TR/file-upload/) so that everything is done locally.  Your file data is kept private and never sent to a server.  It supports [modern HTML5 browsers](http://caniuse.com/#feat=fileapi).

JSON files define file layouts, data types, and formats.  Use these to teach Jiffy your own custom file formats without writing any code.  For details, see the [wiki](https://github.com/derekwlms/jiffy/wiki).  Jiffy includes definitions for formats such as NACHA ACH files.

You can run Jiffy locally or use our [online version](http://jiffy.paymenthorizons.com). Create your own data files or download some [samples](http://paymenthorizons.com/jiffyfiles/jiffy-data.zip).

---

## Running Locally

Pre-requisites: [git](https://git-scm.com/) and [node.js](https://nodejs.org) ([details](https://github.com/derekwlms/jiffy/wiki/Installation)).

1. Get the code: `git clone https://github.com/derekwlms/jiffy.git`
2. `cd jiffy`
3. `npm install && bower install`
4. `grunt serve`
5. [Open in your browser](http://localhost:9000).

See the [wiki](https://github.com/derekwlms/jiffy/wiki/Installation) for other installation options.

To enable console logging, set *debugEnabled* to *true* in app.js.

Use `grunt` to run jshint, tests, and the distribution build.  Use `grunt test` to run the unit tests.

## Documentation

See the [wiki](https://github.com/derekwlms/jiffy/wiki) and [ngdocs](http://paymenthorizons.com/jiffyfiles/docs).

Use `grunt docs` to update the ngdocs.  Then, run `node webserver.js` and [open in a browser](http://localhost/app).

## License
Jiffy is released under the [ISC License](https://opensource.org/licenses/ISC).  See LICENSE.txt.

## Contributing

The usual: fork, work your magic, send me a pull request.  

To share a file format definition, add it to a new folder under *file-definitions* and include the name (commented out) in *definition-names.txt*. 

