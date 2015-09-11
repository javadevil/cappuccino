var router = require('express').Router();
var bcrypt = require('bcrypt');
var authorizer = require('./authorizer.js');

module.exports = Authenticate;
module.exports.Authorizer = authorizer;

function Authenticate() {
    router.get('/auth/', authorizer(['admin','accountant']) ,index);
    router.post('/auth/login', login);
    router.get('/auth/logout',logout);
    return router;
}

function index(req, res, next) {
	return res.json(req.session.user);
}

function login(req, res, next) {
    var users = req.db.collection('users');
    console.log(req.body.username);
    if (req.body.username === undefined) {
        return res.status(401).send('Username undefined');
    }

    var query = {
        '_id': req.body.username
    }

    users.findOne(query, response);

    function response(err, user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
        	delete user.password;
        	req.session.user = user;
            return res.json(user);
        }
        return res.status(401).send('Password does not matched');
    }
}

function logout(req,res,next){
	req.session.destroy(complete);
	function complete (err) {
		if(err){
			next(err);
		}
		return res.send('logout ok');
	}
}
