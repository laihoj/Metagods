var express = require("express");
var router = express.Router();
var passport = require("passport");

//var middleware = require("../middleware/index.js");

var Deck = require("../models/deck");
var Player = require("../models/player");

router.get("/api", function(req,res) {
	res.send("API");
});

router.get("/deck/:deck", function(req,res){
	res.send("decklist get found");
});

router.post("/deck", function(req,res){
	res.send("deck post found");
});

router.get("/player/:player", function(req,res){
	res.send("player get found");
});

router.post("/player", function(req,res){
	var newPlayer = {username: req.body.username, decks:[]};
	Player.register(new Player(newPlayer), req.body.password, function(err, player) {
		if(err) {
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/");
		} else {
			passport.authenticate("local")(req, res, function() {
				req.flash("success", "Logged in");
				res.redirect('/');
			}
		)}
	});
});

module.exports = router;