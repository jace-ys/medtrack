const mongoose = require("mongoose");

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

module.exports = mongoose.model("Staff", staffSchema);
