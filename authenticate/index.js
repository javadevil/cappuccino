var authorize = require('./authorize.js');
var router = require('express').Router();

module.exports = function Authenticate() {
	router.get('/auth/',function index(req,res,next){
		res.send('hello world');
	})
    return router;
}

module.exports.authorize = authorize;