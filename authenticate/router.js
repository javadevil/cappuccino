var router = require('express').Router();
var bcrypt = require('bcrypt');

var auth = function(roles) {
    return function(req, res, next) {
        if (req.session.isAuthenticate) {
            var users = req.app.locals.db.collection('users');
            if (!Array.isArray(roles)) {
                roles = [roles]
            }
            var query = {
                "_id": req.session.user._id,
                "roles": {
                    "$all": roles
                }
            }
            users.findOne(query, function(err, user) {
                if (err) return next(err);

                if (user) {
                    next();
                } else {
                    res.status(401)
                    next(Error("Unauthorize"));
                }
            })
        } else {
            res.status(401);
            next(Error("Unauthorize"));
        }
    }
}

module.exports = function() {
    /**
    GET /
    User profile information.
    **/
    router.get('/', function(req, res, next) {
        if (req.session.user) {
            var users = req.app.locals.db.collection('users');
            var query = {
                _id: req.session.user._id
            };
            var options = {
                fields: {
                    "password": false
                }
            };
            users.findOne(query, options, function(err, user) {
                if (err) return next(err);
                var userObj = {
                    id: user._id,
                    type: "user",
                    data: user
                }
                return res.json(userObj);
            });
        } else {
            res.status(401);
            return next(Error("Unauthorize"));
        }
    });

    router.post('/', auth('admin'), function(req, res, next) {
        var users = req.app.locals.db.collection('users');
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                var data = {
                    _id: req.body.username,
                    password: hash,
                    roles: req.body.roles,
                    name: req.body.name,
                    email: req.body.email
                }
                users.insert(data, function(err, result) {
                    if (err) return next(err);
                    res.set(201);
                    return res.end();
                })
            });
        });
    });

    router.get('/:id', auth('admin'), function(req, res, next) {
        var users = req.app.locals.db.collection('users');
        var query = {
            _id: req.params.id
        }
        var options = {
            password: false
        }
        users.findOne(query, options, function(err, user) {
            if (err) return next(err);

            if (user) {
                return res.json(user);
            } else {
                res.status(404);
                return next(Error('User not found'));
            }
        })
    });

    router.post('/:id/changepassword', auth('admin'), function(req, res, next) {
        var password = req.body.password;
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) return next(err);

                var users = req.app.locals.db.collection('users');
                var query = {
                    _id: req.params.id
                }
                var update = {
                    "$set": {
                        password: hash
                    }
                }
                users.update(query, update, function(err, result) {
                    if (err) return next(err);
                    return res.json(result);
                })
            })
        });
    });

    router.post('/login', function(req, res, next) {
        var users = req.app.locals.db.collection('users');
        var query = {
            "_id": req.body.username
        }
        users.findOne(query, function(err, user) {
            if (err) return next(err);

            if (user) {
                bcrypt.compare(req.body.password, user.password, function(err, result) {
                    if (result) {
                        var sessionObject = {
                            _id: user._id,
                            name: user.name,
                            roles: user.roles
                        }
                        req.session.user = sessionObject;
                        req.session.isAuthenticate = true;
                        var responseData = {
                            id: sessionObject._id,
                            type: "user",
                            data: sessionObject
                        }
                        return res.json(responseData);
                    } else {
                        res.status(401);
                        return next(Error('Incorrect password'));
                    }
                });
            } else {
                res.status(401);
                return next(Error('No user'));
            }
        });
    });

    router.get('/logout', function(req, res, next) {
        req.session.isAuthenticate = false;
        req.session.destroy(function(err) {
            if (err) return next(err);
            res.send('ok');
        });
    });

    return router;
};

module.exports.auth = auth;
