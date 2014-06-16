var express = require('express');
var router = express.Router();
var checkStatus = require('./check_status');

/* GET login page. */
var crypto = require('crypto');
var User = require('../models/user.js');

router.get('/login', checkStatus.checkNotLogin);
router.get('/login', function (req, res){
	res.render('login', {
		title: 'Login'
	});
});
/* POST login page. */
router.post('/login', checkStatus.checkNotLogin);
router.post('/login', function(req, res){
	// generate hashcode of password
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	
	User.get(req.body.username, function(err,user){
		if (!user){
			req.flash('error', 'The User does not exist');
			return res.redirect('/login');
		}
		if (user.password != password){
			req.flash('error', 'wrong password, please try again');
			return res.redirect('/login');
		}
		req.session.user = user;
		req.flash('success', 'Login');
		req.session.save();
		res.redirect('/');
	});
});

module.exports = router;