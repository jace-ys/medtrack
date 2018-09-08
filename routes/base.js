const Staff = require("../models/staff");
const Patient = require("../models/patient");
const Log = require("../models/log");
const express = require("express");
const router = express.Router();

// Routes
router.get("/", (req, res) => {
	res.render("landing");
});

router.get("/home", (req, res) => {
	res.render("home");
});

module.exports = router;
