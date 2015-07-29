var fs = require('fs');

exports.database = {
    url: 'mongodb://localhost/cappuccino',
}
exports.http = {
    enabled: true,
    port: 3000
}
exports.https = {
    enabled: true,
    port: 3001,
    options: {
        key: fs.readFileSync('./keys/cappuccino-key.pem'),
        cert: fs.readFileSync('./keys/cappuccino-cert.pem')
    }
}
exports.csurf = {
    cookie: true,
    cookieInjection: function(req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
    }
}
exports.session = {
    secret: 'cfdf=fiuc*o^uah_#6%+k-dzvc@17966e2!)6_*v19w0hh^i$8x3',
    resave: false,
    saveUninitialized: true,
    storeConfig: {
        db: 'cappuccino'
    }
}
//Router application
exports.applications = [
	{name:'Cappuccino Art',require:'./cappuccino-art',path:'/'},
	{name:'Authenticate',require:'./authenticate',path:'/auth'},
    {name:'Contacts',require:'./contacts',path:'/contacts'}
]