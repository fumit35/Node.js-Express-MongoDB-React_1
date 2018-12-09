var http = require('http');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var Message = require('./schema/Message');
var fileUpload = require('express-fileupload');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var User = require('./schema/User');
var Message = require('./schema/Message');
var app = express();


mongoose.connect('mongodb://localhost:27017/chatapp',
	function(err){
		if(err){
			console.log(err);
		}else{
			console.log("sucessfully connected to MongoDB.");
		}
	}
);
//app.use(function(req,res,next){
//	return res.send('Hello World');
//});

//app.use(bodyparser());
app.use(bodyparser.urlencoded({
	extended:true
}));
app.use(bodyparser.json());

app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

app.use("/image",express.static(path.join(__dirname,'image')));

app.use(session({secret='HogeFuga'}));
app.use(passport.initialize());
app.use(passport());

app.post('/login',passport.authenticate('local'),
	function(res,res){
		
	}
);

//app.get("/",function(req,res,next){
//	return res.send('Hello World!');
//});

//app.get("/",function(req,res,next){
//	return res.render('index',{title:'Hello World!'});
//});
app.get("/",function(req,res,next){
	Message.find({},function(err,msgs){
		if(err) throw err;
		return res.render('index',{messages:msgs});
	});
});
//app.get("/",function(req,res,next){
//	return res.render('index',{title:'Hello World!'});
//});


app.get("/update",function(req,res,next){
	return res.render('update');
});

//app.get("/hoge",function(req,res,next){
//	return res.send('Hoge');
//});

//app.post("/update",function(req,res,next){
//	var newMessage = new Message({
//		username:req.body.username,
//		message:req.body.message
//	});
//	newMessage.save((err)=>{
//		if(err) throw err;
//		return res.redirect("/");
//	});
//});
app.post("/update",fileUpload(),function(req,res,next){
	console.log(req.files.image);
	console.log(req.files);
	if(req.files && req.files.image){
		req.files.image.mv('./image/' + req.files.image.name,
			function(err){
				if(err) throw err;
				var newMessage = new Message({
					username:req.body.username,
					message:req.body.message,
					image_path:'/image/'+ req.files.image.name
				});
				newMessage.save((err)=>{
				if(err) throw err;
				return res.redirect("/");
				});
			}
		);
	}else{
		var newMessage = new Message({
			username:req.body.username,
			message:req.body.message
		});
		newMessage.save((err)=>{
			if(err) throw err;
			return res.redirect("/");
		});
	}
});
var server = http.createServer(app);
server.listen('3000');
