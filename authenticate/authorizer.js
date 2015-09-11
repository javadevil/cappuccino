module.exports = Authorizer;
function Authorizer (roles) {
    return function AuthorizerMiddleWare (req, res, next) {
        if(!!!req.session.user){
            return res.status(401).send('Unauthorized');
        }

        if(roles === undefined){
            return next();
        }

        if(typeof roles === 'string'){
            roles = [roles];
        }

        if(Array.isArray(roles)){

            var sessionRoles = req.session.user.roles;

            for (var i = roles.length - 1; i >= 0; i--) {
                if(sessionRoles.indexOf(roles[i]) >= 0){
                    return next();
                }
            };
        }
        return res.status(401).send('Unauthorized');
    }
}