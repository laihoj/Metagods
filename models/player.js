var mongoose = require("mongoose");

var playerSchema = new mongoose.Schema({
	username: String,
	decks: [{
		id: {
			mongoose.Schema.Types.ObjectId,
			ref: "Decklist"
		},
		name
	}]
});

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("Player", playerSchema);