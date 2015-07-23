var config = require('./config.js');
var MongoClient = require('mongodb');
var Express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var http = require('http');
var https = require('https');

MongoClient.connect(config.database.url, function(err, db) {
    if (err) return console.error(err);

    var app = Express();

    app.use(require('cookie-parser')());
    app.use(require('csurf')(config.csurf));
    app.use(config.csurf.cookieInjection);

    config.session.store = new MongoStore(config.session.storeConfig);
    app.use(session(config.session));

    app.use(function(req, res, next) {
        req.db = db;
        next();
    });

    config.applications.map(function(appData) {
        var router = require(appData.require)();

        if (appData.path) {
            app.use(appData.path, router);
        } else {
            app.use(router);
        }
    })
    if (config.http.enabled) {
        http.createServer(app).listen(config.http.port, function() {
            console.log('Cappuccino server @%s', config.http.port);
        });
    }
    if (config.https.enabled) {
        https.createServer(config.https.options, app).listen(config.https.port, function() {
            console.log('Cappuccino secure server @%s', config.https.port);
        });
    }
})
