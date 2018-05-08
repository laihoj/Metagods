var mongoose = require("mongoose");

var resultSchema = new mongoose.Schema({
	match: Number,
	turns: Number,
	hand: Number,
	player: String,
	deck: String,
	starter: Boolean,
	winner: Boolean
});

module.exports = mongoose.model("Result", resultSchema);