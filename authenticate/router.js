var router = require('express').Router();

var authenticate = require('./authenticate.js');
var authorize = require("./authorize.js");

module.exports = function() {
    router.get("/", authenticate.getCurrentUser);
    router.post("/login", authenticate.login);
    router.get("/logout", authenticate.logout);
    router.get("/users", authorize("admin"),authenticate.getUserList);
    router.get("/users/:id",authorize("admin"),authenticate.getUser);
    return router;
};
