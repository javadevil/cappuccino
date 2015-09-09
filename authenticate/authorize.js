module.exports = function(roles) {
    return function(req, res, next) {
        if (req.session.user) {
            switch (typeof(roles)) {
                case "undefined":
                    return next();
                case "string":
                    roles = [roles];
                case "object":
                    var user = req.session.user;
                    if (Array.isArray(user.roles)) {
                        for (var i = roles.length - 1; i >= 0; i--) {
                            if (user.roles.indexOf(roles[i]) >= 0) return next();
                        }
                    };
                    return res.status(401).end();
            }
        } else {
            return res.status(401).end();
        }
    };
}
