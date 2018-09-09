const Staff = require("../models/staff");
const Patient = require("../models/patient");
const Log = require("../models/log");
const express = require("express");
const router = express.Router();

// Routes
router.get("/", (req, res) => {
	res.render("landing");
});

router.get("/home", async (req, res) => {
	try {
		let patients = await Patient.find();
		res.render("home", {patients: patients});
	} catch(err) {
		console.log(err);
	}
});

module.exports = router;
