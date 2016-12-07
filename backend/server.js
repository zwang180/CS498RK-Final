// Get the packages we need
var express = require('express');
var expressSession = require('express-session');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db_connection = require('./config/secrets').mongo_connection;
var passport = require('passport');

// Create our Express application
var app = express();

// Use environment defined port or 3000
// var port = process.env.PORT || 5000;
var port = 8080;
//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Required for auth
app.use(cookieParser());

// Use session
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Passport config module
require('./config/passport')(passport);

// Use routes as a module (see index.js)
require('./routes')(app, router);

// Connect to the database
mongoose.connect(db_connection);
var db = mongoose.connection;
// On connection error
db.on('error', function(error) {
  console.error('Connection Error:\n  %s: %s', error.name, error.message);
});
// If connection success
db.once('open', function() {
  console.log('Database connection is ready');
});

// Start the server
app.listen(port);
console.log('Server running on port ' + port);
