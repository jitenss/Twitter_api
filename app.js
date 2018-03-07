// Require our dependencies
var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongoose');
var streamRoutes = require('./api/routes/stream');
var searchRoutes = require('./api/routes/search');

//Connection to the the database
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/twitter_api");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to database");
});

//Initialize app
var app = express();

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Set routes to handle requests
app.use('/stream',streamRoutes);
app.use('/search',searchRoutes);


//Seting the port and creating server
var port = process.env.PORT || 3000;
var server = http.createServer(app).listen(port,function(){
 	console.log("Server started on port: " + port);
});
module.exports = server;