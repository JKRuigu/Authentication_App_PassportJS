var express = require('express');
var router = express.Router();

//Get Homepage
router.get('/', function (req,res) {
	res.render('index');
});

//Ensure Authenicated for is to work add ,ensureAuthenticated, in the midddle **router.get('/'^HERE^  function
		///function ensureAuthenticated (req,res,next) {
			//if (req.isAuthenicated()){
			//return next();
			//}else{
				//req.flash('error_msg','You are not logged in!');
			//	res.redirect('/users/login');
//			}
//		}

module.exports = router;