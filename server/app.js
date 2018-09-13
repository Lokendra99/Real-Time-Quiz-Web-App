var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var session = require('express-session');
var cors = require('cors');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit:'10mb', extended: true}));
app.use(morgan('dev'));
app.use(cors());

app.use(express.static(__dirname + '/../client'));

db = mongoose.connect('mongodb://localhost/quiz2');

mongoose.connection.once('open' , function(){

	console.log("Databse connection open success")

});

mongoose.set('debug', true);

 var userModel = require('./app/models/User');

var securityRouter = require('./app/controllers/securityRouter');
app.use('/security', securityRouter);

var queryRouter = require('./app/controllers/queryRouter');
app.use('/queries' , queryRouter);

app.listen(3000 , function(){

	console.log("App running at localhost port 3000");
});
