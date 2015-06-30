var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var async = require('async');
var _ = require('lodash');
var http = require('http');
var ObjectId = mongoose.Types.ObjectId




//code to check if empty json
function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}


//user schema
var userSchema = new mongoose.Schema({
	first: String,
	last: String,
    email: { type: String, unique: true },
    password: String
});

//schema for all artists and bands (parts will be null for artists)
var bandschema = new mongoose.Schema ({
_id: String,
name: String,
image: String,
description: String,
yearstarted: String,
origin: String,
genre: String,
recordlabel: String,
image: String,
albums: [{
      Title: String
  }],
events: [{
    artist: String,
	date: String,
	location: String,
	Stadium: String
  }],
list: [{
    type: String
  }],
members: [{
name: String,
role: String
}]
});

//schema for user comments
var commentschema = new mongoose.Schema ({
user: String,
user_first: String,
artist: String,
type: String,
comment: String
});

var eventschema = new mongoose.Schema ({
user: String,
artist: String,
date: String,
location: String,
Stadium: String
});




//save user into database
userSchema.pre('save', function(next){
    var person = this;

    if(!person.isModified('password')) return next();


    bcrypt.genSalt(10, function(err, salt){
        if(err) return next(err);


        bcrypt.hash(person.password, salt, function(err, hash){
            if(err) return next(err);

            person.password = hash;
            next();
        });
    });


});




//compare passwords to see if the same

userSchema.methods.comparePassword = function(candidatePassword, cb) {

    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {

        if (err) return cb(err);

        cb(null, isMatch);
    });
};


//models
var User = mongoose.model('User', userSchema);
var Band = mongoose.model('Band', bandschema);
var Comment = mongoose.model('Comment', commentschema);
var Event = mongoose.model('Event', eventschema);
//connection to database
mongoose.connect('mongodb://adminjustin:adminjustin@ds055690.mongolab.com:55690/musicinformation');


var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'The robots shall rise' , saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//serialize user
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

//deserialize user
passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
});
});

//check for user match
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if (isMatch) return done(null, user);
      return done(null, false);
    });
  });
}));

//protect routes against people that do not have accounts
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) next();
  else res.send(401);
}

//route for signing up

app.post('/users/signup', function (req, res, next) {

    var newuser = new User ({
		first: req.body.first,
		last: req.body.last,
        email: req.body.email,
        password: req.body.password
    });

    newuser.save(function (err) {
       if(err) return next(err);
 
       res.send(200);
    });

});

//route for signing in 
app.post('/users/signin', passport.authenticate('local'), function(req, res) {
  res.cookie('user', JSON.stringify(req.user));
  res.send(req.user);
});

//route for signing out
app.get('/users/logout', function(req, res, next) {
  req.logout();
  res.send(200);
});

//artist routes//

//add artist



app.post('/users/artists', function (req, res, next) {

  var changed = req.body.artistname.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, '');
   var itunes = req.body.artistname.toLowerCase().replace(/ /g, '+').replace(/[^\w-]+/g, '');
   var bands = req.body.artistname.toLowerCase().replace(/ /g, '').replace(/[^\w-]+/g, '');
	var town = req.body.artistname.toLowerCase();
    
   async.waterfall([
  
    function(callback) {
      
	   request.get('https://www.googleapis.com/freebase/v1/topic/en/'+changed, function(error, response, body) {
			
			var name = JSON.parse(body);
			
			
			 var newband = new Band ({
		_id: (name.id).split('/')[2],
		name: name.property["/type/object/name"].values[0].value, 
        description: name.property["/common/topic/description"].values[0].value,
		yearstarted: name.property["/music/artist/active_start"].values[0].value, 
		origin: name.property["/music/artist/origin"].values[0].text,
		genre: name.property["/music/artist/genre"].values[0].text,
		recordlabel: name.property["/music/artist/label"].values[0].text,
    });
		var person =[];
		var role = [];
		for(var i=0; i< name.property["/music/musical_group/member"].values.length ; i++){
		
		person[i] = name.property["/music/musical_group/member"].values[i].property["/music/group_membership/member"].values[0].text;
		
		if(typeof (name.property["/music/musical_group/member"].values[i].property["/music/group_membership/role"]) != 'undefined'){
		role[i]= name.property["/music/musical_group/member"].values[i].property["/music/group_membership/role"].values[0].text;
		}
		else
		{
		role[i]= "no role exists for member";
		}
		
		
		};
		
		
		var unique = person.filter(function(elem, pos) {
    return person.indexOf(elem) == pos;
  }); 
		
		
		
		for(var i=0; i<unique.length; i++){
		
			newband.members.push({
			name: unique[i],
			role: role[i]
			});
		};
	
		callback(null, newband);
      });
			
    }, function(newband, callback) {
	
	request.get('https://itunes.apple.com/search?term='+itunes, function(error, response, body) {
	
		var data = JSON.parse(body);
		var stuff = [];
		
		for(var i=0; i < data.results.length; i++){
		
			stuff[i] = data.results[i].collectionName;
			
		};
		
		var unique = stuff.filter(function(elem, pos) {
    return stuff.indexOf(elem) == pos;
  }); 
  
		for(var i=0; i < unique.length; i++){
		
			newband.albums.push({
			Title: unique[i]
			});
			
		};
		
	
	callback(null, newband);
      });
	
	
	},  function(newband, callback) {
	
   	request.get('http://api.bandsintown.com/artists/'+town+'/events.json?app_id=musicapp', function(error, response, body) {
			if (error) return next(error);
			
			var data = JSON.parse(body);
			
			if(isEmptyObject(data)){
			newband.events.push({
			artist: "no events right now",
			date: "no events right now",
			location: "no events right now",
			Stadium: "no events right now"
			});
			}
			else{
			
			for(var i=0; i < data.length; i++){
			var date = data[i].datetime.split("T");
			newband.events.push({
			artist: data[i].artists[0].name,
			date: date[0]+" "+date[1],
			location: data[i].venue.city+", "+ data[i].venue.country,
			Stadium: data[i].venue.name
			});
			
			};
				
				
			}
			
			callback(null, newband);
		
		
	});
   
   }, function(newband, callback) {
   
   	request.get('https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q='+bands, function(error, response, body) {
			if (error) return next(error);
			
			var data = JSON.parse(body);
			
			newband.image = data.responseData.results[0].unescapedUrl;

			
			callback(null, newband);
		
		
	});
   
   }
  ], function(err, newband) {
    if (err) return next(err);
    newband.save(function(err) {
      if (err) {
        if (err.code == 11000) {
          return res.send(409, { message: newband.name + ' already exists, go to localhost:3000/'+newband._id+' to add it to your list' });
        }
        return next(err);
      }
      res.send(200);
    });
  });
  
});

app.get('/users/artists/:id', function(req, res, next) {
  Band.findById(req.params.id, function(err, band) {
    if (err) return next(err);
    res.send(band);
  });
});

//giving me issues
app.get('/users/artists', function(req, res, next) {
  var query = Band.find();
	
	
	if(req.query.user){
	query.where({ list: { $in: [req.query.user] } });
	}
	
	else{
	query.limit(12);
	}
  query.exec(function(err, bands) {
    if (err) return next(err);
    res.send(bands);
  });
});

//comment routes

//add comment
app.post('/users/comments', function (req, res, next) {

var newcomment = new Comment ({
	user: req.body.user,
	user_first: req.body.user_first,
	artist: req.body.artist,
	type: req.body.type,
	comment: req.body.comment
    });

    newcomment.save(function (err) {
       if(err) return next(err);
 
       res.send(200);
    });

});

//gets all comments by a user for a band that are private
app.get('/users/comments/:id', function (req, res, next) {
Comment.findById(req.params.id, function(err, comment) {
    if (err) return next(err);
    res.send(comment);
  });

});

//gets all public comments for a band
app.get('/users/comments/', function (req, res, next) {

 var query = Comment.find();
	

	if (req.query.user)
	{
	query.where({ user: req.query.user, type: req.query.type, artist: req.query.artist});
	}
	else if(req.query.type && req.query.artist){
	query.where({ type: req.query.type, artist: req.query.artist });
	}

	else{
	query.limit(12);
	}
  query.exec(function(err, comments) {
    if (err) return next(err);
    res.send(comments);
  });

});


//add event
app.post('/users/events', function (req, res, next) {

var newevent = new Event ({
	user: req.body.user,
	artist: req.body.artist,
	date: req.body.date,
	location: req.body.location,
	Stadium: req.body.Stadium,
    });

    newevent.save(function (err) {
       if(err) return next(err);
 
       res.send(200);
    });

});

//get events for a user
app.get('/users/events/', function (req, res, next) {

 var query = Event.find();
	

	
	if(req.query.user && req.query.artist){
	query.where({ user: req.query.user, artist: req.query.artist });
	}
	else if (req.query.user)
	{
	query.where({ user: req.query.user});
	}
	else{
	query.limit(12);
	}
  query.exec(function(err, events) {
    if (err) return next(err);
    res.send(events);
  });

});


app.get('/users/events/:id', function (req, res, next) {
Event.findById(req.params.id, function(err, event) {
    if (err) return next(err);
    res.send(event);
  });

});

//add to list
app.post('/users/add', ensureAuthenticated, function(req, res, next) {
  Band.findById(req.body.bandid, function(err, band) {
    if (err) return next(err);
    band.list.push(req.user.id);
    band.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  });
});

//remove from list

app.post('/users/remove', ensureAuthenticated, function(req, res, next) {
  Band.findById(req.body.bandid, function(err, band) {
    if (err) return next(err);
    var index = band.list.indexOf(req.user.id);
    band.list.splice(index, 1);
    band.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  });
});

app.use(function(req, res, next) {
  if (req.user) {
    res.cookie('user', JSON.stringify(req.user));
  }
  next();
});

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});


app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({ message: err.message });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
