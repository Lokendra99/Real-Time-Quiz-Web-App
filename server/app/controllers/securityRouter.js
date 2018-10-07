var express = require('express');

var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var events = require('events');
var route = express.Router();
var mongoose = require('mongoose');
var userModel = mongoose.model('User');
var responseGenerator = require('./../../libs/responsegenerator');
var validator = require('./../../middleware/validate');
var moment = require('moment');
var request = require('request');
var qs = require('querystring');
var eventEmitter = new events.EventEmitter();

//jsonwebtoken for authentication
var jwt = require('jwt-simple');

//json secret key
var jsonSecret = "ojdo&*%$&Yjnjc$DFG998bjb";

module.exports.controller=function(app,server){

	function createJWT(user) {
	  var payload = {
	    sub: user._id,
	    iat: moment().unix(),
	    exp: moment().add(14, 'days').unix()
	  };
	  return jwt.encode(payload, jsonSecret);
	}

	function ensureAuthenticated(req, res, next) {
		console.log('req.header '+req.header );
  if (!req.header('Authorization')) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.header('Authorization').split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, jsonSecret);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
}

//Cerate nodemailer to send welcome mail
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth :{
        user: 'chatapp390@gmail.com',
        pass: 'lokendra99'
    }
});

eventEmitter.on('forgotPass', function(data){
var mailOptions = {
        to: data.email,
        from: '"Authentication Team" <chatapp390@gmail.com>',
        subject: '✔ Reset your password on QuizHub',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + data.host + '/#!/reset/' + data.token + '\n\n' +
        'Note: Reset Password Link will Expire in 1 Hour.<br>If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err,info) {
        if(err){
                console.log(err);
            }
            else{
                console.log(info);
            }
      });
});

eventEmitter.on('changePass', function(data){
	console.log(data);
      var mailOptions = {
				to: data,
        from: '"Authentication Team" <chatapp390@gmail.com>',
        subject: 'Your quizHub password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + data + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err,info) {
         if(err){
                console.log(err);
            }
            else{
                console.log(info);
            }
      });
});



	app.post('/auth/login', function(req, res) {
		console.log(req.body);

  userModel.findOne({ email: req.body.email }, function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Invalid email and/or password' });
    }
		else if(!user.password){
			return res.status(401).send({ message: 'Invalid email and/or password' });
		}
    else if(!user.compareHash(req.body.password)) {
        return res.status(401).send({ message: 'Invalid email and/or password' });
      }

      res.send({
				token: createJWT(user) ,
				user:user
			});
    });
  });

//else if(!founduser.compareHash(req.body.pass))

app.post('/auth/signup', function(req, res) {
  userModel.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken' });
    }
    var user = new userModel({
      username: req.body.displayName,
      email: req.body.email,
    });
		user.password = user.generateHash(req.body.password);
    user.save(function(err, result) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
			console.log('result of signup');
			console.log(result);
      res.send({
				token: createJWT(result),
				user:result
			 });
    });
  });
});

app.get('/api/me', ensureAuthenticated, function(req, res) {
  userModel.findById(req.user, function(err, user) {
    res.send(user);
  });
});

//google auth
app.post('/auth/google', function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: '3_Xp_OVamM4Wq0hahOBA2iBc',
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
			console.log(profile);
      if (profile.error) {
        return res.status(500).send({message: profile.error.message});
      }
			 else {
        // Step 3b. Create a new user account or return an existing one.
        userModel.findOne({ email: profile.email}, function(err, existingUser) {
          if (existingUser) {
						console.log('existing user');
            return res.send(
							{ token: createJWT(existingUser),
								user:existingUser
							});
          }
					console.log('new user');
          var user = new userModel();
          //user.google = profile.sub;
          //user.picture = profile.picture.replace('sz=50', 'sz=200');
          user.username = user.username || profile.name;
					user.email=user.email || profile.email;
					user.google=profile.sub;

          user.save(function(err,result) {
            var token = createJWT(user);
						console.log('result '+jsonSecret);
            res.send({
							token: token ,
							user:result
					});
          });
        });
      }
    });
  });
});

app.get('queries/googleDashboard',function(req,res){
	res.send('Succesfully Logged In')
})



app.post('/auth/facebook', function(req, res) {
	console.log('1st');
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: '7dd6f62137ec24d2339a70f89cd9affc',
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
		console.log('step1');
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }
			 else {
        // Step 3. Create a new user account or return an existing one.
        userModel.findOne({ email: profile.email }, function(err, existingUser) {
          if (existingUser) {

						console.log('existing user');
						console.log(existingUser);
            var token = createJWT(existingUser);
            return res.send({
							token: token ,
							user:existingUser
						});
          }
					console.log('new user');
          var user = new userModel();
					user.username = user.username||profile.name;
					user.email=profile.email;
					user.facebook=profile.id;

          user.save(function(err,result) {
            var token = createJWT(user);
						console.log('saving');
            res.send({
							token: token,
							user:result
						 });
          });
        });
      }
    });
  });
});
app.get('/facebook/dashboard',function(req,res){
	res.send('Successfully logged in')
})

 app.post('/forgotPassword',function(req,res){

	 async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      userModel.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.status(400).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account.' });
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
        var data = {
          host: req.headers.host,
          token: token,
          email:user.email
        };
        user.save(function(err) {
          eventEmitter.emit('forgotPass', data);
					res.send({ user: user, msg: 'Send Email to your mail Id.' });
          done(null);


        });
      });
    }
  ],function(err){
		if(err){console.log(err);}
		else{

			console.log("success");
		}
	});
 })

 app.post('/resetpasword/:token',function(req,res){
	 async.waterfall([
    function(done) {
      userModel.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec(function(err, user) {
          if (!user) {
            return res.status(400).send({ msg: 'Password reset token is invalid or has expired.' });
          }
          user.password = user.generateHash(req.body.password);

          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          var data = user.email;
          user.save(function(err) {
            eventEmitter.emit('changePass', data);
						res.send({ user: user, msg: 'Password Reset Successfully.' });
						done(null);

          });
        });
    }
  ],function(err){
		if(err){console.log(err);}
		else{

			console.log("success here later");
		};
 })
})
}
