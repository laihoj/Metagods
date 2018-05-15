var mongoose = require("mongoose");

var deckSchema = new mongoose.Schema({
	name: String,
	tappedout: String,
	author: String
});

module.exports = mongoose.model("Deck", deckSchema);