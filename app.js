var bodyParser 				= require("body-parser"),
	mongoose 				= require("mongoose"),
	flash					= require("connect-flash"),
	express 				= require("express"),
	passport 				= require("passport"),
	LocalStrategy 			= require("passport-local"),
	passportLocalMongoose 	= require("passport-local-mongoose"),
	request					= require("request"),
	methodOverride			= require("method-override"),
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
app.use(methodOverride("_method"));
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
// var Meta = require("./models/meta");

app.use('/api', require("./routes/apiRoutes"));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/faqs", function(req, res) {
	res.render("faqs");
});



/*********************************************
APP ROUTES
*********************************************/


app.get("/decks", function(req,res){
	request("http://" + domain + "/api/decks", function(err, response, body) {
		var decks = JSON.parse(body);
		if(req.isAuthenticated()) {
			decks.forEach(function(deck){
				req.user.decks.forEach(function(favouriteDeck){
					if(deck.name == favouriteDeck) {
						deck["favourite"] = true;
					}
				});
			});
		}
		res.render("decks",{decks:decks});
	});
});

app.get("/decks/new", function(req, res) {
	res.render("newdeck");
});

app.post("/decks", createDeck, isAuthenticated, addDeckToPlayerFavourites, function(req,res){
	res.redirect("/decks");
});

app.get("/decks/:deck", function(req, res){
	request("http://" + domain + "/api/decks/" + req.params.deck, function(err, response, body) {
		res.render("deck",{deck:JSON.parse(body)});
	});
});

app.put("/players/:player/", function(req, res) {
	User.findOneAndUpdate({username:req.params.player}, req.body.player, function(err, updatedPlayer) {
		if(err) {
			res.redirect("/");
		} else {
			req.flash("success", "Deck favourites updated");
			res.redirect("/decks");
		}
	});
});

app.get("/results", function(req, res) {
	request("http://" + domain + "/api/results", function(err, response, body) {
		res.render("results",{results:JSON.parse(body)});
	});
});

app.get("/results/new", retreiveAllDecks, retreiveAllPlayers, function(req, res) {
	request("http://" + domain + "/api/players", function(err, response, body) {
		JSON.parse(body).forEach(function(player){
			res.cookie(player.username, player.decks);
		})
		res.render("newresult",{players:0});
	});
});

app.post("/matches", createMatch, function(req, res) {
	req.flash("success", "Successfully published match result");
	res.redirect("/results/new");
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

app.get("/", function(req,res) {
	res.render("index");
});

/*********************************************
MIDDLEWARE
*********************************************/

function isAuthenticated(req,res,next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.session.redirectTo = req.path;
	req.flash("error", "Please login first");
	res.redirect("/login");
}

function addMetaToCookie(req, res, next) {
	// alert("addMetaToCookie NOT IMPLEMENTED");
}

function createMeta(req, res, next) {
	var meta = [];
	for(var i = 0; i < req.body.result['player'].length; i++) {
		var player = {
			"username":req.body.result['player'][i],
			"deck":req.body.result['deck'][i],
		}
		meta.push(player);
	}
	console.log(meta);
	Meta.create({"players":meta}, function(err, newMeta) {
		if(err) {
			req.flash("error", "Meta not saved");
			res.redirect("/");
		} else {
			req.flash("success", "Meta saved");
			res.locals.metagame = newMeta;
			res.redirect("/results/new");
		}
	});
	// alert("createMeta NOT IMPLEMENTED");
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
	Result.findOne().sort("-match").exec(function(err, resultWithBiggestMatchNumber) {
		if(err) {
			console.log(err);
		} else {
			if(resultWithBiggestMatchNumber) {
				req.body.result.match = resultWithBiggestMatchNumber.match + 1;
			} else {
				req.body.result.match = 1;
			}
			createResult(req.body.result, req.body.numberOfPlayers, req.body.numberOfPlayers, next);
		}
	});
}

//recursively create results. 
//better than a for loop, because next() called only once
function createResult(results, n, numberOfPlayers, next) {
	if(n <= 0) {
		return next();
	} else {
		var starter = results["starter"] == numberOfPlayers - n + 1;
		var winner = results["winner"] == numberOfPlayers - n + 1;
		var time = Date.now();
		if(Array.isArray(results["player"])) {
			var result = {
				match: results.match,
				turns: results["turns"],
				player: results["player"][numberOfPlayers - n],
				deck: results["deck"][numberOfPlayers - n],
				hand: results["hand"][numberOfPlayers - n],
				starter: starter,
				winner: winner,
				time: time
			}
		} else {
			var result = {
				match: results.match,
				turns: results["turns"],
				player: results["player"],
				deck: results["deck"],
				hand: results["hand"],
				starter: starter,
				winner: winner,
				time: time
			}
		}
		if(!result.player.includes("Default")) { //as soon as form is player-dynamic, remove this condition
			Result.create(result, function(err, newResult) {
				if(err) {
					console.log(err);
					res.redirect("/");
				} else {
					console.log("Result logged");
					createResult(results, n - 1, numberOfPlayers, next);
				}
			});
		} else {
			createResult(results, n - 1, numberOfPlayers, next);
		}
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
			// foundDecks.unshift({"name":"--Default--"});
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
			// console.log(foundResults);
			res.locals.allResults = foundResults;
			return next();
		}
	});
}

app.listen(process.env.PORT || 3000, function() {
	console.log("Metagods");
});