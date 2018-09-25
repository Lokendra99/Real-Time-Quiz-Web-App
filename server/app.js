var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');

var cors = require('cors');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');


var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit:'10mb', extended: true}));
app.use(morgan('dev'));
app.use(cors());

var http=require('http');
var server=http.createServer(app);


app.use(express.static(__dirname + '/../client'));


//for automation of getting  JS files from models and controllers
fs.readdirSync('./app/controllers').forEach(function(file){
  if(file.indexOf('.js')){
    var route=require('./app/controllers/'+file);
    route.controller(app,server,passport);
  }
});

fs.readdirSync('./app/models').forEach(function(file){
  if(file.indexOf('.js')){
    require('./app/models/'+file);
  }
});



db = mongoose.connect('mongodb://localhost/quiz2');

mongoose.connection.once('open' , function(){

	console.log("Databse connection open success")

});

mongoose.set('debug', true);



server.listen(3000 , function(){

	console.log("App running at localhost port 3000");
});
