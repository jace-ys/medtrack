const Staff = require("../models/staff");
const Patient = require("../models/patient");
const Log = require("../models/log");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	try {
		let patients = await Patient.find();
		res.render("patients/index", {patients: patients});
	} catch(err) {
		console.log(err);
	}
});

router.get("/new", (req, res) => {
	res.render("patients/new");
});

router.post("/", async (req, res) => {
	try {
		let newPatient = await Patient.create(req.body);
		console.log(newPatient);
		res.redirect("/home");
	} catch(err) {
		console.log(err);
	}
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
