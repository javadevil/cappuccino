var router = require('express').Router();
var serveStatic = require('serve-static');

module.exports = ServeStatic;
function ServeStatic () {
	router.use('/',serveStatic(__dirname+'/apps'));
	router.use('/bower_components',serveStatic(__dirname+'/bower_components'));
	return router;
}
