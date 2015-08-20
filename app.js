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

    app.locals.db = db;

    app.use(require('morgan')(config.logger.format));
    app.use(require('cookie-parser')());


    config.session.store = new MongoStore(config.session.storeConfig);
    app.use(session(config.session));
    if (config.csurf.enabled) {
        app.use(require('csurf')(config.csurf.options));
        app.use(function(req, res, next) {
            res.cookie(config.csurf.token, req.csrfToken());
            next();
        });
    }
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    config.applications.map(function(appData) {
        var router = require(appData.require)();
        if (appData.path) {
            app.use(appData.path, router);
        } else {
            app.use(router);
        }
    })

    app.use(function(err, req, res, next) {
        if (res.statusCode === 200) {
            res.status(500);
        }

        res.json({
            error: err.name,
            message: err.message,
            timestamp: new Date().getTime()
        })
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
