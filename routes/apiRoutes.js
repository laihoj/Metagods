var express = require("express"),
	request	= require("request"),
	router	= express();

var User = require("../models/user");
var Deck = require("../models/deck");
var Result = require("../models/result");
var Meta = require("../models/meta");

/*********************************************
API ROUTES
*********************************************/

router.get("/", function(req,res) {
	res.render("api");
});

router.get("/decks", function(req,res) {
	Deck.find({}, function(err, foundDecks) {
		if(err) {
			console.log(err);
		} else {
			res.send(foundDecks);
		}
	});
});

router.get("/results", function(req,res) {
	Result.find({}, function(err, foundResults) {
		if(err) {
			console.log(err);
		} else {
			res.send(foundResults);
		}
	});
});

router.get("/players", function(req,res) {
	User.find({}, function(err, foundUsers) {
		if(err) {
			console.log(err);
		} else {
			foundUsers.unshift({"username":"--Default--"});
			res.send(foundUsers);
		}
	});
});

router.get("/decks/new", function(req, res) {
	res.render("partials/newdeckform");
});

router.get("/addplayer", retreiveAllDecks, retreiveAllPlayers, function(req, res) {
	res.render("partials/playermatchrow", {players:0});
});

// router.get("/results/new", function(req, res) {
// 	res.render("partials/playermatchrow");
// });

router.get("/players/new", function(req, res) {
	res.render("partials/registerform");
});

router.get("/players/:player", function(req, res) {
	User.findOne({name:req.params.player}, function(err, foundPlayer){
		console.log("error", err);
		console.log("Fetched " + foundPlayer);
		res.send(foundPlayer);
	});
});

router.get("/decks/:deck", function(req,res) {
	Deck.findOne({name:req.params.deck}, function(err, foundDeck){
		console.log("error", err);
		console.log("Fetched " + foundDeck);
		res.send(foundDeck);
	});
});




// function isAuthenticated(req,res,next) {
// 	if(req.isAuthenticated()) {
// 		return next();
// 	}
// 	req.session.redirectTo = req.path;
// 	req.flash("error", "Please login first");
// 	res.redirect("/login");
// }

// function addMetaToCookie(req, res, next) {
// 	// alert("addMetaToCookie NOT IMPLEMENTED");
// }

// function createMeta(req, res, next) {
// 	var meta = [];
// 	for(var i = 0; i < req.body.result['player'].length; i++) {
// 		var player = {
// 			"username":req.body.result['player'][i],
// 			"deck":req.body.result['deck'][i],
// 		}
// 		meta.push(player);
// 	}
// 	console.log(meta);
// 	Meta.create({"players":meta}, function(err, newMeta) {
// 		if(err) {
// 			req.flash("error", "Meta not saved");
// 			res.redirect("/");
// 		} else {
// 			req.flash("success", "Meta saved");
// 			res.redirect("/results/new");
// 		}
// 	});
// 	// alert("createMeta NOT IMPLEMENTED");
// }

// function createDeck(req, res, next) {
// 	Deck.create(req.body.deck, function(err, newDeck) {
// 		if(err) {
// 			console.log(err);
// 			req.flash("error", "Deck not created");
// 			res.redirect("/");
// 		} else {
// 			console.log("Deck added");
// 			req.flash("success", "New Deck Created");
// 			res.locals.newDeck = newDeck;
// 			return next();
// 		}
// 	});
// }

// function createMatch(req, res, next) {
// 	Result.count({}, function(err, Count) {
// 		if(err) {
// 			console.log(err);
// 			res.redirect("/");
// 		} else {
// 			Count ++;
// 			req.body.result.match = Count;
// 			createResult(req.body.result, req.body.numberOfPlayers, req.body.numberOfPlayers, next);
// 		}
// 	});
// }

// //recursively create results. 
// //better than a for loop, because next() called only once
// function createResult(results, n, numberOfPlayers, next) {
// 	if(n <= 0) {
// 		return next();
// 	} else {
// 		var starter = results["starter"] == numberOfPlayers - n + 1;
// 		var winner = results["winner"] == numberOfPlayers - n + 1;
// 		var time = Date.now();
// 		if(Array.isArray(results["player"])) {
// 			var result = {
// 				match: results.match,
// 				turns: results["turns"],
// 				player: results["player"][n - 1],
// 				deck: results["deck"][n - 1],
// 				hand: results["hand"][n - 1],
// 				starter: starter,
// 				winner: winner,
// 				time: time
// 			}
// 		} else {
// 			var result = {
// 				match: results.match,
// 				turns: results["turns"],
// 				player: results["player"],
// 				deck: results["deck"],
// 				hand: results["hand"],
// 				starter: starter,
// 				winner: winner,
// 				time: time
// 			}
// 		}
// 		Result.create(result, function(err, newResult) {
// 			if(err) {
// 				console.log(err);
// 				res.redirect("/");
// 			} else {
// 				console.log("Result logged");
// 				createResult(results, n - 1, numberOfPlayers, next);
// 			}
// 		});
// 	}
// }

// function addDeckToPlayerFavourites(req, res, next) {
// 	User.findOneAndUpdate({_id:req.user._id}, 
// 		{
// 			$addToSet: {decks:res.locals.newDeck.name}
// 		}, function(err, foundUser) {
// 		if(err) {
// 			console.log("Failed to add deck to players favourites");
// 			console.log(err);
// 			req.flash("error","Failed to add deck to players favourites");
// 			return next();
// 		} else {
// 			console.log("Deck added to players favourites");
// 			req.flash("success","Deck added to players favourites");
// 			return next();
// 		}
// 	});
// }

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

// function retreiveAllResults(req, res, next) {
// 	Result.find({}, function(err, foundResults) {
// 		if(err) {
// 			console.log(err);
// 		} else {
// 			// console.log(foundResults);
// 			res.locals.allResults = foundResults;
// 			return next();
// 		}
// 	});
// }

module.exports = router;