var mongoose = require("mongoose");

var resultSchema = new mongoose.Schema({
	match: Number,
	player: String,
	deck: String,
	starter: Boolean,
	winner: Boolean,
	startinghand: Number
});

module.exports = mongoose.model("Result", resultSchema);