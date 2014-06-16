var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');

/* GET home page. */
router.get('/', function(req, res) {
	Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		res.render('index', {
			title : 'Main Page',
			posts : posts,
		});
	});
});

module.exports = router;