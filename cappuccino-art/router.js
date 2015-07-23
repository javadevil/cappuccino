var router = require('express').Router();

module.exports = function(){
	var serveStatic = require('serve-static');
	router.use(serveStatic(__dirname+'/ui'));
	router.use('/l',serveStatic(__dirname+'/node_modules'));
	return router;
}