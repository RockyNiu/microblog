var mongodb = require('./db');

function Post(username, post, time) {
	this.user = username;
	this.post = post;

	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
};

module.exports = Post;

Post.prototype.save = function save(callback) {
	// Save into MongoDB
	var post = {
		user : this.user,
		post : this.post,
		time : this.time,
	};
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// Read posts Collection
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			// Add the index for user
			collection.ensureIndex('user', function(err, user) {
				mongodb.close();
				callback(err, post);
			});
			// Write post
			collection.insert(post, {
				safe : true
			}, function(err, post) {
				mongodb.close();
				callback(err, post);
			});
		});
	});
};
Post.get = function get(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// Read posts Collection
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			// Query user = username, if username=null, then get all users
			var query = {};
			if (username) {
				query.user = username;
			}
			collection.find(query).sort({
				time : -1
			}).toArray(function(err, docs) {
				mongodb.close();
				if (err) {
					callback(err, null);
				}
				// Box posts into Post object
				var posts = [];
				docs.forEach(function(doc, index) {
					var post = new Post(doc.user, doc.post, doc.time);
					posts.push(post);
				});
				callback(null, posts);
			});
		});
	});
};