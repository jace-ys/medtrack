const Staff = require("../models/staff");
const express = require("express");
const router = express.Router();

router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", (req, res) => {
	res.redirect("/login");
});

router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", (req, res) => {
	res.redirect("/home");
});

module.exports = router;
