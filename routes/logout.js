var express = require('express');
var router = express.Router();
var checkStatus = require('./check_status');

/* GET logout*/
router.get('/logout', checkStatus.checkLogin);
router.get('/logout', function(req, res){
	req.session.user = null;
	req.flash('success', 'Logout');
	req.session.save();
	res.redirect('/');
});

module.exports = router;