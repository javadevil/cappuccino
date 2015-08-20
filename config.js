var fs = require('fs');

module.exports = {
    database: {
        url: "mongodb://localhost/cappuccino"
    },

    http: {
        enabled: false,
        port: 3000
    },

    https: {
        enabled: true,
        port: 3001,
        options: {
            key: fs.readFileSync('./keys/cappuccino-key.pem'),
            cert: fs.readFileSync('./keys/cappuccino-cert.pem')
        }
    },

    session: {
        secret: 'cfdf=fiuc*o^uah_#6%+k-dzvc@17966e2!)6_*v19w0hh^i$8x3',
        resave: false,
        saveUninitialized: true,
        storeConfig: {
            db: 'cappuccino'
        },
        cookie: {
            secure: true
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