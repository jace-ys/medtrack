const Staff = require("../models/staff");
const Patient = require("../models/patient");
const Log = require("../models/log");
const express = require("express");
const router = express.Router();

//middleware to check if user is logged in
function isLoggedIn(req,res, next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect("/");

}

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
		res.redirect("/home");
	} catch(err) {
		console.log(err);
	}
});

router.get("/:patient_id", async (req, res) => {
	try {
		let patient = await Patient.findOne({_id: req.params.patient_id}).populate({
			path: "logs",
			options: { sort: { createdAt: -1 }, limit: 6 }
		}).exec();
		// let prev = await Patient.findOne({_id: {$lt: req.params.patient_id}}).sort({_id: -1}).exec();
		// let next = await Patient.findOne({_id: {$gt: req.params.patient_id}}).sort({_id: 1}).exec();
		res.render("patients/show", {patient: patient});
	} catch(err) {
		console.log(err);
	}
});

router.get("/:patient_id/edit", async (req, res) => {
	try {
		let patient = await Patient.findOne({_id: req.params.patient_id});
		res.render("patients/edit", {patient: patient});
	} catch(err) {
		console.log(err);
	}
});

router.put("/:patient_id", async (req, res) => {
	try {
		let updatedPatient = await Patient.findOneAndUpdate({_id: req.params.patient_id}, req.body);
		res.redirect(`/patients/${updatedPatient._id}`);
	} catch(err) {
		console.log(err);
	}
});

router.delete("/:patient_id", async (req, res) => {
	try {
		await Patient.deleteOne({_id: req.params.patient_id});
		res.redirect("/home");
	} catch(err) {
		console.log(err);
	}
});

module.exports = router;
