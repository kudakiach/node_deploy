const mongoose = require('mongoose')
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/CarDb',{useNewUrlParser:true},(err) => {
	if(!err){
		console.log('mongodb connected')
	}else{ console.log(' connection error')}
})
let adminSchema = new mongoose.Schema({
	firstName:{
		type:String
	},
	lastName:{
		type:String
	},
	email:{
		type:String
	},
	username:{
		type:String
	},
	mobile:{
		type:String
	},
	address:{
		type:String
	},
	town:{
		type:String
	},
	city:{
		type:String
	},
	password:{
		type:String
	}
})

var Admin = module.exports = mongoose.model('Admin',adminSchema);

module.exports.getUserById = function(id, callback){
	Admin.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	Admin.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword,hash, callback){
	// Load hash from your password DB.
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
	    callback(null,isMatch);
	});
}


