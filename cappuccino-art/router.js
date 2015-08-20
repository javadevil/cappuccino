var router = require('express').Router();
var serveStatic = require('serve-static');

module.exports = function(){	
	router.use(serveStatic(__dirname+'/polymer/app'));
	router.use('/bower_components',serveStatic(__dirname+'/polymer/bower_components'));
	return router;
}