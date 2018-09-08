const Staff = require("../models/staff");
const Patient = require("../models/patient");
const Log = require("../models/log");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("patients/index");
});

router.get("/new", (req, res) => {
	res.render("patients/new");
});

router.post("/", (req, res) => {
	let newPatient = req.body;
	console.log(newPatient);
	res.redirect("/home");
});

router.get("/:patient_id", (req, res) => {

});

router.get("/:patient_id/edit", (req, res) => {

});

router.put("/:patient_id", (req, res) => {

});

router.delete("/:patient_id", (req, res) => {

});

module.exports = router;
