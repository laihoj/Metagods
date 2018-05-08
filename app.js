var bodyParser 				= require("body-parser"),
	mongoose 				= require("mongoose"),
	flash					= require("connect-flash"),
	express 				= require("express"),
	passport 				= require("passport"),
	LocalStrategy 			= require("passport-local"),
	passportLocalMongoose 	= require("passport-local-mongoose"),
	request					= require("request");
	app						= express();

app.use(require("express-session")({
	secret: process.env.SECRET || "SECRETSTRING",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(flash());

var url = process.env.DATABASEURL || "mongodb://jaakko:laiho@ds261929.mlab.com:61929/metagods";
mongoose.connect(url);

var domain = process.env.DOMAIN || "localhost:3000";
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

var User = require("./models/user");
var Deck = require("./models/deck");
var Result = require("./models/result");


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/api", function(req,res) {
	res.send("API");
});

app.get("/api/decks", retreiveAllDecks, function(req,res) {
	res.send(res.locals.allDecks);
});

app.get("/api/results", retreiveAllResults, function(req,res) {
	res.send(res.locals.allResults);
});

app.get("/api/players", retreiveAllPlayers, function(req,res) {
	res.send(res.locals.allPlayers);
});

app.get("/decks", function(req,res){
	request("http://" + domain + "/api/decks", function(err, response, body) {
		res.render("decks",{decks:JSON.parse(body)});
	});
});

app.post("/decks", createDeck, isAuthenticated, addDeckToPlayerFavourites, function(req,res){
	res.redirect("/decks");
});

app.get("/results", function(req, res) {
	request("http://" + domain + "/api/results", function(err, response, body) {
		res.render("results",{results:JSON.parse(body)});
	});
});

// app.post("/results", createResult, function(req, res) {
// 	res.redirect("/results");
// });

app.post("/matches", createMatch, function(req, res) {
	res.redirect("/results");
});

app.get("/players/:player", isAuthenticated, function(req,res){
	res.render("profile");
});

app.post("/players", function(req,res){
	var newPlayer = {
		username: req.body.username,
		decks: []
	};
	User.register(new User(newPlayer), req.body.password, function(err, user) {
		if(err) {
			console.log(err);
			res.redirect("/");
		} else {
			passport.authenticate("local")(req, res, function() {
				res.redirect(req.session.redirectTo || '/players/' +req.user.username);
				delete req.session.redirectTo;
			}
		)}
	});
});

app.post("/login", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), function(req, res) {
	if(!req.user) {
		req.flash("error", "Issue signing up");
		res.redirect("/login");
	} else {
		req.flash("success", "Logged in");
		res.redirect(req.session.redirectTo || '/players/' +req.user.username);
		delete req.session.redirectTo;
	}
});

app.get("/login", function(req, res) {
	res.render('login');
});

app.get("/register", function(req, res) {
	res.render('register');
});

app.get("/logout",function(req, res){
	req.logout();
	req.flash("success", "Logged out");
	res.redirect("/");
});

app.get("/", retreiveAllPlayers, retreiveAllDecks, function(req,res) {
	res.render("index",{players:0});
});

function isAuthenticated(req,res,next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.session.redirectTo = req.path;
	req.flash("error", "Please login first");
	res.redirect("/login");
}

function createDeck(req, res, next) {
	Deck.create(req.body.deck, function(err, newDeck) {
		if(err) {
			console.log(err);
			req.flash("error", "Deck not created");
			res.redirect("/");
		} else {
			console.log("Deck added");
			req.flash("success", "New Deck Created");
			res.locals.newDeck = newDeck;
			return next();
		}
	});
}



function createMatch(req, res, next) {
	Result.count({}, function(err, Count) {
		if(err) {
			console.log(err);
			res.redirect("/");
		} else {
			Count ++;
			req.body.result.match = Count;
			createResult(req.body.result, req.body.numberOfPlayers, next);
		}
	});
}

//recursively create results. 
//better than a for loop, because next() called only once
function createResult(results, n, next) {
	if(n <= 0) {
		return next();
	} else {
		var result = {
			match: results.match,
			player: results["player"][n - 1],
			deck: results["deck"][n - 1],
			hand: results["hand"][n - 1],
			/*
			PROBABLE THEORY:
			pretty fucking shitty problem, probably worth reconsidering schemas.
			Because form has multiple inputs with same name, those inputs are
			under that key in an array. Unless of course the inputs are checkboxes,
			because checkbox values are not sent _at all_ if not checked
			*/
			// starter: results["starter"][n - 1],
			// winner: results["winner"][n - 1]
		}
		Result.create(result, function(err, newResult) {
			if(err) {
				console.log(err);
				res.redirect("/");
			} else {
				console.log("Result logged");
				createResult(results, n - 1, next);
			}
		});
	}
}

function addDeckToPlayerFavourites(req, res, next) {
	User.findOneAndUpdate({_id:req.user._id}, 
		{
			$addToSet: {decks:res.locals.newDeck.name}
		}, function(err, foundUser) {
		if(err) {
			console.log("Failed to add deck to players favourites");
			console.log(err);
			req.flash("error","Failed to add deck to players favourites");
			return next();
		} else {
			console.log("Deck added to players favourites");
			req.flash("success","Deck added to players favourites");
			return next();
		}
	});
}

function retreiveAllPlayers(req, res, next) {
	User.find({}, function(err, foundUsers) {
		if(err) {
			console.log(err);
		} else {
			console.log(foundUsers);
			foundUsers.unshift({"username":"--Default--"});
			res.locals.allPlayers = foundUsers;
			return next();
		}
	});
}

function retreiveAllDecks(req, res, next) {
	Deck.find({}, function(err, foundDecks) {
		if(err) {
			console.log(err);
		} else {
			console.log(foundDecks);
			foundDecks.unshift({"name":"--Default--"});
			res.locals.allDecks = foundDecks;
			return next();
		}
	});
}

function retreiveAllResults(req, res, next) {
	Result.find({}, function(err, foundResults) {
		if(err) {
			console.log(err);
		} else {
			console.log(foundResults);
			res.locals.allResults = foundResults;
			return next();
		}
	});
}

app.listen(process.env.PORT || 3000, function() {
	console.log("Metagods");
});