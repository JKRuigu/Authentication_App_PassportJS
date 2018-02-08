var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//importing Users Constructor
var User = require('../models/user');

//Register 
router.get('/resgister',function (req,res) {
	res.render('resgister');
});

//Login 
router.get('/login',function (req,res) {
	res.render('login');
});

//Register POST
router.post('/resgister',function (req,res) {
	var name = req.body.name;
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name','Name is required').notEmpty();
	req.checkBody('email','Email is required ').notEmpty();
	req.checkBody('email','Email is not valid').isEmail();
	req.checkBody('username','Userame is required').notEmpty();
	req.checkBody('password','Password is required').notEmpty();
	req.checkBody('password2','Password does not match').equals(req.body.password);


	var errors = req.validationErrors();

	if (errors) {
		res.render('resgister',{
			errors :errors
		});
	} else {
		var newUser = new User({
			name :name,
			email :email,
			username: username,
			password :password
		});

	 	User.createUser(newUser,function (err,user) {
	 		if (err) throw err; 
	 	});
	 	req.flash('success_msg','You are registered and can now Login');
	 	res.redirect('/users/login');
	}
});

//Username and Password Confirmation
passport.use(new LocalStrategy(
	function (username,password,done) {
	 User.getUserByUsername(username,function(err,user) {
		if (err) throw err; 
		if (!user) {
			return done(null,false,{message:'Unknown User'});
		}

		User.comparePassword(password,user.password,function (err,isMatch) {
			if (err)  throw err;
			if (isMatch) {
				return done(null,user);
			}else{
				return done(null,false,{message:'Invalid password'});
			}
		});	
	  });
	}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});



//authentication
router.post('/login',
  passport.authenticate('local', {successRedirect:'/',failureRedirect:'/users/login',failureFlash :true }),
  function(req, res) {
  	res.redirect('/');  
  });
 //logout
 router.get('/logout', function (req,res) {
 	req.logout();
 	req.flash('success_msg','You are logged out')
 	res.redirect('/users/login')
 })

module.exports = router; 