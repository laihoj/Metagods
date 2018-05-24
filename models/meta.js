var mongoose = require("mongoose");

var metaSchema =  mongoose.Schema({
	name: String,
	players: [{
		username:String,
		deck:String
	}]
});

module.exports = mongoose.model("Meta", metaSchema);