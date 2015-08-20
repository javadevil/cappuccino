module.exports = function(roles) {
    return function(req, res, next) {
        if (req.session.user) {
        	
            switch (typeof(roles)) {
                case "undefined":
                    return next();
                case "string":
                    roles = [roles];
                case "object":
                	var query = {
                		"_id": req.session.user._id,
                        "roles": {
                            "$all": roles
                        }
                	}
                	var users = req.app.locals.db.collection("users");
            		users.findOne(query,function(err,user){
            			if (err) return next(err);
            			console.log(user);
            			if(user) return next();

            			res.status(401);
            			return res.end();
            		});
            }
        } else {
            res.status(401);
            return res.end();
        }
    };
}
