var mongoose = require("mongoose");

var matchSchema = new mongoose.Schema({
	matchNumber: Number,
	players: ,
	cardlist: ,
	turns: Number,
	result: [{
		player: String,
		deck: String,
		starter: Boolean,
		winner: Boolean,
		startinghand: Number
	}]

});

module.exports = mongoose.model("Match", matchSchema);