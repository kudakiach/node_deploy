const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Admin = require('../models/adminModels');
const {check, validationResult} = require('express-validator');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;



router.get('/admin', (req, res) => {
	res.render('admin/index',{Title:"Admin"});
})

router.post('/login',passport.authenticate('local',{failureRedirect:'/login', failureFlash:'invalid email or password'}),
  function(req, res) {
    req.flash('success','you have been logged in');
    res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Admin.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username,password,done){
	Admin.getUserByUsername(username,function(err,user){
		if(err) throw err;
		if(!user){
			return done(null,false, {message:'Uknown admin'});
		}
		Admin.comparePassword(password, user.password, function(err,isMatch){
			if(err) throw err;
			if(isMatch){
				return done(null,user)
			}else{
				return(false, {message:'no admin found'})
			}
		})
	})
}));


router.post('/Admin',[
	check('firstName','name is required').not().isEmpty(),
	check('lastName','LastName is required').not().isEmpty(),
	check('mobile','mobile is required').not().isEmpty(),
	check('adminname','adminname is required').not().isEmpty(),
	check('address','Address is required').not().isEmpty(),
	check('city','city is required').not().isEmpty(),
	check('email','Not a valid Email').isEmail(),
	
	check("password", "password must contain minimum of 4 characters")
        .isLength({ min: 4 })
        .custom((value,{req, loc, path}) => {
            if (value !== req.body.confirmpass) {
                // trow error if passwords do not match
                throw new Error("Passwords don't match");
            } else {
                return value;
            }
        })
    
	],(req,res) => {
	let fname = req.body.firstName;
	let lname = req.body.lastName;
	let email = req.body.email;
	let adminname = req.body.adminname;
	let mobile = req.body.mobile;
	let address = req.body.address;
	let town = req.body.town;
	let city = req.body.city;
	let pass = req.body.password;
	
	
	//form validator
	
	
	 var errors = validationResult(req);

	if(!errors.isEmpty()){
		// console.log(errors.array())
		res.render('admin/index',{errors:errors.array()})
	}else{
		bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(req.body.password, salt, function(err, hash) {
    		req.body.password = hash;
    		
  			let admin = {
			firstName:fname,
			lastName:lname,
			email:email,
			adminname:adminname,
			mobile:mobile,
			address:req.body.address,
			town:town,
			city:city,
			password:hash
		}
		var model = new Admin(req.body);
		model.save()
			.then(doc => {
				if(!doc || doc.length === 0){
					res.status(500).send(doc)
				}else{
					res.render('./admin/index',{success:"registered",Title:""})
				}
			})
			.catch(err =>{
				if(err){
					res.status(500).json(err)
				}
			})

    	});
	});

		
	}  	
	
		
})

//authenticating admin
router.get('/login', (req, res) => {
	res.render('./admin/auth')
})

// router.get('/logout', function(req, res){
//   req.logout();
//   req.session.destroy();
//   res.redirect('/login');
// });
router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy(function (err) {
        if (err) {
            return next(err);
        }

        // destroy session data
        req.session = null;

        // redirect to homepage
        res.redirect('/login');
    });
});

module.exports = router;