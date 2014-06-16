// logger
var fs = require('fs');
var date = (new Date()).toISOString().substring(0,10);
var accessLogfile = fs.createWriteStream('access_logger_' + date + '.log', {
	flags : 'a'
});
var errorLogfile = fs.createWriteStream('error_logger_' + date + '.log', {
	flags : 'a'
});

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var settings = require('./models/settings');

var routes = require('./routes/index');
var reg = require('./routes/reg');
var login = require('./routes/login');
var logout = require('./routes/logout');
var post = require('./routes/post');
var user = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger({
	stream : accessLogfile
}));
app.use(favicon());
// app.use(logger('dev'));
app.use(bodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash()); // used before session
app.use(session({
	secret : settings.cookieSecret,
	key : settings.db, // cookie name
	cookie : {
		maxAge : 1000 * 60 * 60 * 24 * 30,
	}, // 30 days
	store : new MongoStore({
		db : settings.db
	})
}));

// dynamicHelper
app.use(function(req, res, next) {
	res.locals.user = req.session.user;

	var err = req.flash('error');
	if (err.length)
		res.locals.error = err;
	else
		res.locals.error = null;

	var succ = req.flash('success');
	if (succ.length)
		res.locals.success = succ;
	else
		res.locals.success = null;
	next();
});

app.use('/', routes);
app.use('/', reg);
app.use('/', login);
app.use('/', logout);
app.use('/', post);
app.use('/', user);

// / catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// / error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	var meta = '[' + new Date() + ']' + req.url + '\n' + err.stack + '\n';
	errorLogfile.write(meta);
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : {}
	});
});

app.listen(3000);
module.exports = app;