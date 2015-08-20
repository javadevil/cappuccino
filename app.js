var config = require('./config.js');
var MongoClient = require('mongodb');
var Express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);

var http = require('http');
var https = require('https');

var app = Express();
MongoClient.connect(config.database.url, function(err, db) {
    if (err) return console.error(err);

    //Database register
    app.locals.db = db;

    //Logger 
    app.use(require('morgan')(config.logger.format));

    //Session 
    config.session.store = new MongoStore(config.session.storeConfig);
    app.use(session(config.session));

    //Body parser
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    //Application loader
    config.applications.map(function(application) {
        var router = require(application.require)();
        if (application.path) {
            app.use(application.path, router);
            console.log(application.name, 'Loaded');
        } else {
            app.use(router);
        }
    })

    //Error handler
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

    //HTTP
    if (config.http.enabled) {
        http.createServer(app).listen(config.http.port, function() {
            console.log('Cappuccino HTTP port', config.http.port, 'started');
        });
    }
    //HTTPS
    if (config.https.enabled) {
        https.createServer(config.https.options, app).listen(config.https.port, function() {
            console.log('Cappuccino HTTPS port', config.https.port, 'started');
        });
    }
})
