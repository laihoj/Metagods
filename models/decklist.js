var mongoose = require("mongoose");

var decklistSchema = new mongoose.Schema({
	name: String,
	tappedouturl: String,
	cardlist: [String]
});

module.exports = mongoose.model("Decklist", decklistSchema);