const Staff = require("../models/staff");
const Patient = require("../models/patient");
const Log = require("../models/log");
const express = require("express");
const router = express.Router();

router.get("/", isLoggedIn, async (req, res) => {
	try {
		let patients = await Patient.find();
		res.render("patients/index", {patients: patients});
	} catch(err) {
		console.log(err);
	}
});

router.get("/new", isLoggedIn, (req, res) => {
	res.render("patients/new");
});

router.post("/", isLoggedIn, async (req, res) => {
	try {
    let newPatient = req.body;
    newPatient.doctor = {
      id: req.user._id,
      name: req.user.name
    }
    let patient = await Patient.create(newPatient);
    let doctor = await Staff.findOne({username: req.user.username});
    doctor.patients.push(patient);
    await doctor.save();
		res.redirect("/home");
	} catch(err) {
		console.log(err);
	}
});

router.get("/:patient_id", isLoggedIn, async (req, res) => {
	try {
		let patient = await Patient.findOne({_id: req.params.patient_id}).populate({
			path: "logs",
			options: { sort: { createdAt: -1 }, limit: 6 }
		}).exec();
		res.render("patients/show", {patient: patient});
	} catch(err) {
		console.log(err);
	}
});

router.get("/:patient_id/edit", isLoggedIn, patientPermissions, async (req, res) => {
	try {
		//let patient = await Patient.findOne({_id: req.params.patient_id});
		res.render("patients/edit", {patient: req.patient});
	} catch(err) {
		console.log(err);
	}
});

router.put("/:patient_id", isLoggedIn, patientPermissions, async (req, res) => {
	try {
		let updatedPatient = await Patient.findOneAndUpdate({_id: req.params.patient_id}, req.body);
		res.redirect(`/patients/${updatedPatient._id}`);
	} catch(err) {
		console.log(err);
	}
});

router.delete("/:patient_id", isLoggedIn, patientPermissions, async (req, res) => {
	try {
    // Remove patient from user's list of patients
    await Staff.findOneAndUpdate({_id: req.user._id}, { $pull:
      { patients: req.params.patient_id }
    });
    // Delete logs associated to the patient
    await Log.deleteMany({
      _id: { $in: req.patient.logs }
    });
    // Delete patient
    await Patient.deleteOne({_id: req.params.patient_id});
		res.redirect("/home");
	} catch(err) {
		console.log(err);
	}
});

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Check patient permissions
async function patientPermissions(req, res, next) {
	try {
		let patient = await Patient.findOne({_id: req.params.patient_id});
		if(patient.doctor.id.equals(req.user._id)) {
      req.patient = patient;
			next();
		} else {
      console.log("Permission denied");
      res.redirect("back");
    }
	} catch(err) {
		console.log(err);
		res.redirect("back");
	}
}

module.exports = router;
