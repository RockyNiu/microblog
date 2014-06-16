var express = require('express');
var router = express.Router();
var checkStatus = require('./check_status');
var Post = require('../models/post.js');

/* POST post page. */
router.post('/post', checkStatus.checkLogin);
router.post('/post', function (req, res){
	var currentUser = req.session.user;
	var post = new Post(currentUser.name, req.body.post);
	post.save(function(err){
		if (err){
			req.flash('error', err);
			req.session.save();
			return res.redirect('/');
		}
		req.flash('success', 'Published');
		req.flash('error', null);
		req.session.save();
		res.redirect('/u/' + currentUser.name);
	});
});

module.exports = router;