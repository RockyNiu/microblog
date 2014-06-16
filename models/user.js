/**
 * user object
 */
var mongodb = require('./db');

function User(user) {
	this.name = user.name;
	this.password = user.password;
};

module.exports = User;

User.prototype.save = function save(callback) {
	// Save into MongoDB
	var user = {
		name : this.name,
		password : this.password,
	};
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// Read users Collection
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			// Add the index of name
			collection.ensureIndex('name', {
				unique : true
			}, function(err, user) {
				mongodb.close();
				callback(err, user);
			});
			// Write user
			collection.insert(user, {
				safe : true
			}, function(err, user) {
				mongodb.close();
				callback(err, user);
			});
		});
	});
};

User.get = function get(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// Read users Collecetion
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			// Query user.name = username
			collection.findOne({
				name : username
			}, function(err, doc) {
				mongodb.close();
				if (doc){
					// Box User as User object
					var user = new User(doc);
					callback(err, user);
				} else {
					callback(err, null);
				}
			});
		});
	});
};
