var fs = require('fs');

module.exports = {
    database: {
        url: "mongodb://localhost/cappuccino"
    },

    http: {
        enabled: true,
        port: 3000
    },

    https: {
        enabled: true,
        port: 3002,
        options: {
            key: fs.readFileSync('./keys/cappuccino-key.pem'),
            cert: fs.readFileSync('./keys/cappuccino-cert.pem')
        }
    },

    csurf: {
        enabled: false,
        options: {
            cookie: true,
        }

    },

    session: {
        secret: 'cfdf=fiuc*o^uah_#6%+k-dzvc@17966e2!)6_*v19w0hh^i$8x3',
        resave: false,
        saveUninitialized: true,
        storeConfig: {
            db: 'cappuccino'
        }
    },

    logger: {
        //Morgan Logger format
        format: 'dev'
    },
    
    applications: [{
        name: 'Cappuccino Art',
        require: './cappuccino-art',
        path: '/'
    }, {
        name: 'Authenticate',
        require: './authenticate',
        path: '/auth'
    }, {
        name: 'Contacts',
        require: './contacts',
        path: '/contacts'
    }]
}