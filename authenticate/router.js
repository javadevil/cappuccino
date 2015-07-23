var router = require('express').Router();
module.exports = function() {

    router.all('/', function(req, res, next) {
        res.send("auth ok!");
    });

    return router;
};
