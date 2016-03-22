
/////////////////////////////////////////
///////////// Setup Node.js /////////////
/////////////////////////////////////////
var express = require('express');
var session = require('express-session');
var compression = require('compression');
var serve_static = require('serve-static');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
var url = require('url');
var async = require('async');
var setup = require('./setup');
var cors = require("cors");
var fs = require("fs");
var favicon = require('serve-favicon');
var request = require('request');


/////////////////////////////////////////////////////////////////////////////////////////////
////////Create our server object with configurations -- either in the cloud or local/////////
////////////////////////////////////////////////////////////////////////////////////////////

var host = setup.SERVER.HOST;
var port = setup.SERVER.PORT;

/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// Configure our webserver and set defaults////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
app.set('views', path.join(__dirname, '/views')); // telling express that the views are found in view directory
app.set('view engine', 'ejs'); // telling express the view engine is ejs
app.engine('.html', require('ejs').__express);  // telling express to render static pages ending in html using ejs
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(serve_static(path.join(__dirname, 'public')) );
app.use(favicon(path.join(__dirname + '/public/images/favicon.ico')));

/////////////////////////////////////////////////////////////////////////////////////////////
////////////////// Configure our webserver to use Mongo for sessions/////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
var MongoStore = require('connect-mongo')(session)
app.use(session({
	store: new MongoStore({
		url: 'mongodb://cpcc-coder:cpccs3cr3t@ds011389.mlab.com:11389/blockchain'
	}),
	secret:'Somethignsomething1234!test', resave:true, saveUninitialized:true}));

// Enable CORS preflight across the board.
app.options('*', cors());
app.use(cors());
// default for every http call on the website
app.use(function(req, res, next){
	var keys;
	console.log('------------------------------------------ incoming request ------------------------------------------');
	console.log('New ' + req.method + ' request for', req.url);
	req.bag = {};    // create an object to collect some date throughout the process
	req.session.count = eval(req.session.count) + 1;
	var url_parts = url.parse(req.url, true);
	req.parameters = url_parts.query;
	keys = Object.keys(req.parameters);
	if(req.parameters && keys.length > 0) console.log({parameters: req.parameters});		//print request parameters
	keys = Object.keys(req.body);
	if (req.body && keys.length > 0) console.log({body: req.body});						//print request body
	next();
});

/////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// Routes -- with Home Route = '/' /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

app.use('/', require('./routes/site_router'));

////////////////////////////////////////////
////////////// Error Handling //////////////
////////////////////////////////////////////
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {		// = development error handler, print stack trace
	console.log("Error Handler -", req.url);
	var errorCode = err.status || 500;
	res.status(errorCode);
  req.bag.error = {msg:err.stack, status:errorCode};
	if(req.bag.error.status == 404) req.bag.error.msg = "Sorry, I cannot locate that file";
	res.render('template/error', {bag:req.bag});
});

/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////      Launch the Webserver       /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(port, function() {});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.env.NODE_ENV = 'production';
server.timeout = 240000;																							// Ta-da.
console.log('------------------------------------------ Server Up - ' + host + ':' + port + ' ------------------------------------------');
if(process.env.PRODUCTION) console.log('Running using Production settings');
else console.log('Running using Developer settings');
