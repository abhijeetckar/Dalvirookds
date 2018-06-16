// set up ======================================================================
require('dotenv').config();
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 8000; 				// set the port
var database = require('./config/database'); 			// load the database config
var logger = require('morgan');
var bodyParser = require('body-parser');



	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(logger('dev'));						// log every request to the console
	app.use(bodyParser.json());						// pull information from html in POST
	//app.use(methodOverride()); 						// simulate DELETE and PUT

	

// configuration ===============================================================
mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io

mongoose.Promise = global.Promise;

mongoose.connection.on('error', function() {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
})

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
