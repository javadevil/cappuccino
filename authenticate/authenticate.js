var bcrypt = require('bcrypt');

var users = function(req) {
    return req.app.locals.db.collection('users');
};

module.exports = {
    /**
    Login function 
    @param username
    @param password 
    */
    login: function(req, res, next) {
        'use strict';
        if (req.body.username && req.body.password) {
            var query = {
                _id: req.body.username
            };
            users(req).findOne(query, function(err, user) {
                if (err) return next(err);
                if (user) {
                    bcrypt.compare(req.body.password, user.password, function(err, result) {
                        if (result) {
                            delete user.password;
                            req.session.user = user;
                            return res.json(user);
                        } else {
                            return next(Error('Password incorrect'));
                        }
                    });
                } else {
                    return next(Error('User incorrect'));
                }
            });
        } else {
            res.status(400);
            return next(Error('Invalid parameter'));
        }
    },
    logout: function(req, res, next) {
        'use strict';
        if (req.session.user) {
            req.session.destroy(function(err) {
                if (err) return next(err);
                return res.end();
            })
        } else {
            res.status(401);
            return res.end();
        }
    },
    getUserList: function(req, res, next) {
        'use strict';
        var options = {
            'fields': {
                'name': true,
                'email': true
            }
        };
        users(req).find({}, options).toArray(function(err, doc) {
            if (err) return next(err);

            return res.json(doc);
        });
    },
    getUser: function(req, res, next) {
        'use strict';
        var query = {
            '_id': req.params.id
        }
        var options = {
            'fields': {
                'password': false
            }
        }
        users(req).findOne(query, options, function(err, user) {
            if (err) return next(err);
            if (user) {
                res.json(user);
            } else {
                res.status(404);
                res.end();
            }
        })
    },

    getCurrentUser: function(req, res, next) {
        'use strict'
        if (req.session.user) {
            req.params.id = req.session.user._id;
            return getUser(req, res, next);
        } else {
            res.status(401);
            return res.end();
        }
    }
}
