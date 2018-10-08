const Staff = require("../models/staff");
const Patient = require("../models/patient");
const Log = require("../models/log");
const express = require("express");
const router = express.Router();

// Routes
router.get("/", (req, res) => {
	res.render("landing");
});

router.get("/home", isLoggedIn, async (req, res) => {
	try {
		let doctor = await Staff.findOne({username: req.user.username}).populate("patients").exec();
		res.render("home", {patients: doctor.patients});
	} catch(err) {
		console.log(err);
	}
});

// Middleware
// Check if user is logged in
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
};

module.exports = router;
