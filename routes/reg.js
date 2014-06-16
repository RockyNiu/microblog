var express = require('express');
var router = express.Router();
var checkStatus = require('./check_status');

/* GET registration page. */
var crypto = require('crypto');
var User = require('../models/user.js');

router.get('/reg', checkStatus.checkNotLogin);
router.get('/reg', function(req, res) {
	res.render('reg', {
		title : 'Registration'
//		user : req.session.user,
//		success : req.flash('success').toString(),
//		error : req.flash('error').toString()
	});
});

/* POST registration page. */
router.post('/reg', checkStatus.checkNotLogin);
router.post('/reg', function(req, res) {
	// Check whether the passwords are same
	if (req.body['password-repeat'] != req.body['password']) {
		req.flash('error', 'Different passwords, please try again');
		return res.redirect('/reg');
	}
	// get hashcode of password
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	var newUser = new User({
		name : req.body.username,
		password : password,
	});

	// check whether user exists
	User.get(newUser.name, function(err, user) {
		if (user)
			err = 'User already exists';
		if (err) {
			req.flash('error', err);
			return res.redirect('/reg');
		}
		// Add new User
		newUser.save(function(err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/reg');
			}
			req.session.user = newUser;
			req.flash('success', 'Congradulation! Registrated successfully');
			req.flash('error', null);
			req.session.save(); // very important!!
			return res.redirect('/');
		});
	});
});

module.exports = router;