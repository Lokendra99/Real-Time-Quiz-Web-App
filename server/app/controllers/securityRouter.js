var express = require('express');
var route = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var responseGenerator = require('./../../libs/responsegenerator');
var validator = require('./../../middleware/validate');

//jsonwebtoken for authentication
var jwt = require('jsonwebtoken');

//json secret key
var jsonSecret = "ojdo&*%$&Yjnjc$DFG998bjb";

module.exports.controller=function(app,server){

//login route
route.post('/login' ,validator.login, function(req , res){
    //search for entered emailid in db
	User.findOne({email: req.body.email}, function(error , founduser){

		console.log(founduser)

		if(error){
			var err = responseGenerator.generate(true , "Some error occured : "+error, 500, null);
			res.json(err);
		}else if(founduser===null || founduser===undefined || founduser.name===null || founduser.name===undefined){
			var response = responseGenerator.generate(true , "No user found !! Check email" , 401, null );
			//res.json(response);
			res.status(400).end("Must provide email and password");
		}else if(!founduser.compareHash(req.body.pass)){
			var response = responseGenerator.generate(true , "Wrong password" , 401, null );
			res.status(400).end("Wrong password");
		}else{

			//creating token for user to authenticate other requests
			var token = jwt.sign({
				email: founduser.email,
				name: founduser.name
			}, jsonSecret);
      //jwt.sign(payload, secretOrPrivateKey, [options, callback])
			console.log(founduser)
			var response = responseGenerator.generate(false , "Logged in Successfully" , 200 , founduser);
			response.token = token;
			res.send(response);
		}

	});

});// end login route

//signup route
route.post('/signup', validator.signup, function(req , res){

	//check if email id already exists
	User.findOne({email: req.body.email} , function(error , founduser){

		if(error){
			var err = responseGenerator.generate(true , "Some error occured : "+error, 500, null);
			res.json(err);
		}else if(founduser){
			var err = responseGenerator.generate(true , "emailid already exists", 401, null);
			res.json(err);
		}else{
            //instantiating new user model
			var newUser = new User({
        name: req.body.name,
			  email: req.body.email,
		    mobileNum: req.body.mobileNum
			});
			newUser.pass = newUser.generateHash(req.body.pass);

			//save the user data in databse
			newUser.save(function(error){
				if(error){
					var response = responseGenerator.generate(true , "Some error occured : "+error, 500, null);
					res.json(response);
				}else{

					var token = jwt.sign({
						email: newUser.email,
						name: newUser.name
					}, jsonSecret);
					var response = responseGenerator.generate(false , "Successfully signed in", 200, newUser);
					response.token = token;
					res.json(response);
				}
			});
		}
	});

});//end signup route





//export route
 app.use('/security',route);

}
