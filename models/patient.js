const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
	name: String,
	photo: String,
	age: Number,
	gender: String,
	ward: String,
	diagnosis: String,
  admitted: { type: Date, default: Date.now },
  doctor: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff"
    },
    name: String
  },
  logs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Log"
	}]
});

module.exports = mongoose.model("Patient", patientSchema);
