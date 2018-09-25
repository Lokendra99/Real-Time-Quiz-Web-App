var express = require('express');
var route = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var responseGenerator = require('./../../libs/responsegenerator');
var validator = require('./../../middleware/validate');
var moment = require('moment');
var request = require('request');

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



	app.post('/auth/login', function(req, res) {
		console.log(req.body);

  User.findOne({ email: req.body.email }, '+password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Invalid email and/or password' });
    }
    else if(!user.compareHash(req.body.password)) {
        return res.status(401).send({ message: 'Invalid email and/or password' });
      }
      res.send({ token: createJWT(user) });
    });
  });

//else if(!founduser.compareHash(req.body.pass))

app.post('/auth/signup', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken' });
    }
    var user = new User({
      displayName: req.body.displayName,
      email: req.body.email,
      //password: req.body.password
    });
		user.password = user.generateHash(req.body.password);
    user.save(function(err, result) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
			console.log('result of signup');
			console.log(result);
      res.send({ token: createJWT(result) });
    });
  });
});

app.get('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
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
      //Step 3a. Link user accounts.
      // if (req.header('Authorization')) {
      //   User.findOne({ google: profile.sub }, function(err, existingUser) {
      //     if (existingUser) {
      //       return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
      //     }
			// 			console.log('result ');
      //     var token = req.header('Authorization').split(' ')[1];
      //     var payload = jwt.decode(token, jsonSecret);
			// 		console.log(payload);
      //     User.findById(payload.sub, function(err, user) {
      //       if (!user) {
      //         return res.status(400).send({ message: 'User not found' });
      //       }
			// 			console.log(profile);
      //       //user.google = profile.sub;
      //       //user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
      //       user.displayName =profile.name;
			// 			user.email=profile.email;
      //       user.save(function(err,result) {
      //         var token = createJWT(user);
			// 				console.log('user saved details');
			// 				console.log(result);
      //         res.send({ token: token });
      //       });
      //     });
      //   });
      // }
			 else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ email: profile.email}, function(err, existingUser) {
          if (existingUser) {
						console.log('existing user');
            return res.send({ token: createJWT(existingUser) });
          }
					console.log('new user');
          var user = new User();
          //user.google = profile.sub;
          //user.picture = profile.picture.replace('sz=50', 'sz=200');
          user.displayName = profile.name;
					user.email=profile.email;
          user.save(function(err,result) {
            var token = createJWT(user);
						console.log('result '+jsonSecret);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

app.get('queries/googleDashboard',function(req,res){
	res.send('reached here')
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
      // if (req.header('Authorization')) {
      //   User.findOne({ facebook: profile.id }, function(err, existingUser) {
      //     if (existingUser) {
      //       return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
      //     }
      //     var token = req.header('Authorization').split(' ')[1];
      //     var payload = jwt.decode(token, config.TOKEN_SECRET);
      //     User.findById(payload.sub, function(err, user) {
      //       if (!user) {
      //         return res.status(400).send({ message: 'User not found' });
      //       }
      //       user.facebook = profile.id;
      //       user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
      //       user.displayName = user.displayName || profile.name;
      //       user.save(function() {
      //         var token = createJWT(user);
      //         res.send({ token: token });
      //       });
      //     });
      //   });
      // }
			 else {
        // Step 3. Create a new user account or return an existing one.
        User.findOne({ email: profile.email }, function(err, existingUser) {
          if (existingUser) {
						console.log('existing user');
            var token = createJWT(existingUser);
            return res.send({ token: token });
          }
					console.log('new user');
          var user = new User();
          // user.facebook = profile.id;
          // user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          // user.displayName = profile.name;
					user.displayName = profile.name;
					user.email=profile.email;
          user.save(function() {
            var token = createJWT(user);
						console.log('saving');
            res.send({ token: token });
          });
        });
      }
    });
  });
});
app.get('/facebook/dashboard',function(req,res){
	res.send('reached here')
})
//export route
 //app.use('/security',route);

}
