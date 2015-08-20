var router = require('express').Router();

var authenticate = require('./authenticate.js');
var authorize = require("./authorize.js");

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
                    res.status(401);
                    res.end();
                }
            })
        } else {
            res.status(401);
            res.end();
        }
    }
}

module.exports = function() {
    router.get("/", authenticate.getCurrentUser);
    router.post("/login", authenticate.login);
    router.get("/logout", authenticate.logout);
    router.get("/users", authorize("admin"),authenticate.getUserList);
    router.get("/users/:id",authorize("admin"),authenticate.getUser);
    return router;
};

module.exports.auth = auth;
