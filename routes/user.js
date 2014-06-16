var express = require('express');
var router = express.Router();
//var checkStatus = require('./check_status');

/* GET user page. */
//var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');

//router.get('/', checkStatus.checkNotLogin);
router.get('/u/:user', function (req, res){
	User.get(req.params.user, function(err, user){
		if (!user) {
			req.flash('error', 'User does not exist');
			req.session.save();
			return res.redirect('/');
		}
		Post.get(user.name, function(err, posts){
			if (err) {
				req.flash('error', err);
				req.session.save();
				return res.redirect('/');
			}
			res.render('user', {
				title: user.name,
				posts: posts,
			});
		});
	});
});

module.exports = router;