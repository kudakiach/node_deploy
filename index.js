const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const hbs = require('express-handlebars')
const bcryptjs = require('bcryptjs')
const expressValidator = require('express-validator')
const mongoose = require('mongoose')
const ejs = require('ejs')
const pug = require('pug')
const flash = require('connect-flash');
const message = require('express-messages');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const adminRouter = require('./controllers/adminController'); 
const userRouter = require('./controllers/userController'); 
const app = express()

//set views
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());


//handle session
app.use(session({
  secret:'secret',
  saveUninitialized: false,
  resave: true
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

//flash messages
app.use(flash());
app.use(function(req,res,next) {
	res.locals.messages = require('express-messages')(req,res);
	next();
});


app.use(adminRouter)
app.use(userRouter)

app.get('*', function(req,res,next) {
	//local variable to hold user info
	res.locals.user = req.user ||  null;
	next();
});



//handler error 404 - page not found
app.use((req, res, next) =>{
    res.status(404).send("error 404, page not found");
})

//handler error 500
// app.use((err, req, res, next) => {
//     console.log(err.stack);
//     res.sendFile(path.join(__dirname, './public/500.html'))
// });

//creating connection
app.listen(3000, () =>{
	console.log('server started at port 3000')
})