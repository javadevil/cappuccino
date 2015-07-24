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
        users.findOne({
            _id: req.body.username
        }, function(err, user) {
            if (err) return next(err);
            if (user) {
                if (user.password === req.body.password) {
                    var obj = {
                        _id: user._id,
                        name: user.name,
                        roles: user.roles
                    }
                    req.session.user = obj;
                    return res.json(obj);
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
        req.session.destroy(function(err) {
            if (err) return next(Error("Can't destroy session"));
            res.send('ok');
        });
    });

    return router;
};
