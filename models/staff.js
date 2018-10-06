const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const staffSchema = new mongoose.Schema({
	username: String,
	name: String,
	role: String,
	password: String,
	patients: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Patient"
	}]
});

staffSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Staff", staffSchema);
