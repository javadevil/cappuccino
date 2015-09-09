var settings = require('./settings.json');
var MongoClient = require('mongodb');
var app = require('express')();

MongoClient.connect(settings.database.url, applicationInit);

function applicationInit(err, database) {
    if (err) {
        return console.error(err);
    }

    app.use(initLogger());
    app.use(initSession());
    app.use(initBodyParser());
    app.use(initAppModule());
    app.use(initErrorHandler());

    initServer(app);
}

function initLogger() {
    var Logger = require('morgan');
    console.log('Logger: %s', settings.logger.format);
    return Logger(settings.logger.format);
}

function initSession() {
    console.log('Session initialized');
    var Session = require('express-session');
    var MongoStore = require('connect-mongo')(Session);
    settings.session.store = new MongoStore(settings.session.storeConfig);
    return Session(settings.session);
}

function initBodyParser() {
    console.log('Body parser initialized');
    var BodyParser = require('body-parser');
    var urlencodedOptions = {
        'extended': true
    }
    return [BodyParser.json(), BodyParser.urlencoded(urlencodedOptions)];
}

function initAppModule() {
    var modules = [];
    for (var i = settings.appModule.length - 1; i >= 0; i--) {
        var module = settings.appModule[i];
        if (module.path) {
            console.log('AppModule initialized: %s', module.moduleName || module.path);
            var Module = require(module.path);
            modules.push(Module());
        }
    };
    return modules;
}

function initErrorHandler() {
    return function errorHandler(err, req, res, next) {
        res.status(500).end();
        console.error(err);
    }
}

function initServer(app) {
    if (settings.http.enabled) {
        var http = require('http');
        var port = settings.http.port || 3000;
        http.createServer(app).listen(port, function httpSuccess() {
            console.log('Http server port: %s', port);
        });
    }

    if (settings.https.enabled) {
        var https = require('https');
        var fs = require('fs');
        var port = settings.https.port || 3001;
        var sslOptions = {
            key: fs.readFileSync(settings.https.ssl.key),
            cert: fs.readFileSync(settings.https.ssl.cert)
        }
        https.createServer(sslOptions, app).listen(port, function httpsSuccess() {
            console.log('Https server port: %s', port);
        });
    }
}
