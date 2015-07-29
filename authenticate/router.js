var router = require('express').Router();


module.exports = function() {

    router.all('/', function(req, res, next) {
        if (req.session.user) {
            return res.json(req.session.user);
        } else {
            res.status(401);
            return next(Error("Unauthorize"));
        }
    });

    router.post('/login', function(req, res, next) {
        var users = req.db.collection('users');
        var query = {
            "_id": req.body.username
        }
        users.findOne(query, function(err, user) {
            if (err) return next(err);

            if (user) {
                if (user.password === req.body.password) {
                    var sessionObject = {
                        _id: user._id,
                        name: user.name,
                        roles: user.roles
                    }
                    req.session.user = sessionObject;
                    req.session.isAuthenticate = true;
                    return res.json(sessionObject);
                } else {
                    return next(Error('Password incorrect'));
                }
            } else {
                res.status(401);
                return next(Error('No user'));
            }
        });
    });

    router.all('/logout', function(req, res, next) {
        req.session.isAuthenticate = false;
        req.session.destroy(function(err) {
            if (err) return next(err);
            res.send('ok');
        });
    });

    return router;
};

module.exports.auth = function(roles) {
    return function(req, res, next) {
        if (req.session.isAuthenticate) {
            var users = req.db.collection('users');
            if (!Array.isArray(roles)) {
                roles = [roles]
            }
            var query = {
                "_id":req.session.user._id,
                "roles":{"$all":roles}
            }
            console.log(query);
            users.findOne(query,function(err,user){
                if(err)return next(err);

                if(user){
                    console.log(user)
                    next();
                } else {
                    res.status(401)
                    next(Error("Unauthorize role"));
                }
            })
        } else {
            res.status(401);
            next(Error("Unauthorize"));
        }
    }

}
