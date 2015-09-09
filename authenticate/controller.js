var bcrypt = require('bcrypt');

var Models = module.exports = function(db) {
    this.users = db.collection('users');
    return {
        getUser: function(id, callback) {
            var query = {
                '_id': id
            }
            users.findOne(query, callback);
        },
        getArrayList: function(callback) {
        	var options = {
        		'fields':{
        			'password':false
        		}
        	}
        	users.find({},options).toArray(callback);
        }
    }
};

module.exports = function(app) {
    this.app = app
    this.oa = Models(app.locals.db);

    return {
        getUser: function(req, res, next) {
            oa.getUser(req.params.userId, function(err, user) {
                if (err) return next(err);
                delete(user.password);
                return res.json(user);
            });
        },
        getCurrentUser: function(req, res, next) {
            return res.json(req.session.user);
        },
        getUsersList: function(req,res,next){
        	oa.getArrayList(function(err,users){
        		if(err) next(err);
        		return res.json(users);
        	});
        },
        login: function(req, res, next) {
            oa.getUser(req.body.username, function(err, user) {
                if (err) return next(err);
                if (user) {
                    bcrypt.compare(req.body.password, user.password, function(err, result) {
                        if (err) return next(err);
                        if (result) {
                            delete(user.password);
                            req.session.user = user;
                            return res.json(user);
                        } else {
                            res.status(401).end();
                        }
                    });
                } else {
                    return res.status(401).end();
                }
            })
        },
        
            req.session.destroy(function(err) {
                if (err) return next(err);
                return res.end();
            });
        }
    }
}

module.exports.models = Models
