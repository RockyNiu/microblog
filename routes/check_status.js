/* check login */
module.exports.checkLogin = function(req, res, next){
	if (!req.session.user){
		req.flash('error', 'Please Login!');
		req.session.save();
		return res.redirect('/login');
	}
	next();
};

/* check not login*/
module.exports.checkNotLogin = function(req, res, next){
	if (req.session.user){
		req.flash('error', 'Login already!');
		req.session.save();
		return res.redirect('/');
	}
	next();
};