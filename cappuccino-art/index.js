var router = require('express').Router();
var serveStatic = require('serve-static');

module.exports = CappuccinoArt;
function CappuccinoArt () {
	router.use('/',serveStatic(__dirname+'/app'))
	router.use('/bower_components',serveStatic(__dirname+'/bower_components'));
	return router;
}