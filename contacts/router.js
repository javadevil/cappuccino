var router = require('express').Router();
var authenticate = require('../authenticate');
module.exports = function() {
    router.all('/',authenticate.auth("admin") ,function(req, res, next) {
    	res.msg = 'Random'
    	res.msg += Math.random().toFixed(4);
    	res.send(res.msg);
    })

    return router;
}
