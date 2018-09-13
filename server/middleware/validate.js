//validate login form
exports.login = function(req ,res, next){
	var body = req.body;
	if(!body.email || !body.pass){
		res.status(400).end("Must provide email and password");
	}else{
		next();
	}
}

//validate signup form
exports.signup = function(req , res, next){
	var body = req.body;
	if(!body.name || !body.mobileNum || !body.email || !body.pass){
		res.status(400).end("All the fields are mendatory");
	}else{
		next();
	}
}
