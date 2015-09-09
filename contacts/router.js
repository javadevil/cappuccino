var router = require('express').Router();
module.exports = function() {
    router.all('/' ,function(req, res, next) {
    	res.msg = 'Random'
    	res.msg += Math.random().toFixed(4);
    	res.send(res.msg);
    })

    return router;
}
