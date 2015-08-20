var repl = require('repl');


console.log("Cappuccino Admin console");
var context = repl.start(">").context;
context.admin = function(){
	console.log("hahha");
	return 1;
}
