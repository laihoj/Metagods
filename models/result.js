var mongoose = require("mongoose");

var resultSchema = new mongoose.Schema({
	match: Number,
	turns: Number,
	hand: Number,
	players: Number,
	player: String,
	deck: String,
	starter: Boolean,
	winner: Boolean,
	time: Date
});

module.exports = mongoose.model("Result", resultSchema);