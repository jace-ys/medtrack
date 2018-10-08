// Require dependencies
const Staff = require("../models/staff");
const Patient = require("../models/patient");
const Log = require("../models/log");
const express = require("express");
const router = express.Router();

// Patient INDEX route
router.get("/", isLoggedIn, async (req, res) => {
	try {
		// Find all patients
		let patients = await Patient.find();
		res.render("patients/index", {patients: patients});
	} catch(err) {
		console.log(err);
	}
});

// Patient NEW route
router.get("/new", isLoggedIn, (req, res) => {
	res.render("patients/new");
});

// Patient CREATE route
router.post("/", isLoggedIn, async (req, res) => {
	try {
		// Create newPatient object
    let newPatient = req.body;
		// Associate to doctor
    newPatient.doctor = {
      id: req.user._id,
      name: req.user.name
    }
		// Create patient in database
    let patient = await Patient.create(newPatient);
		// Find associated doctor
    let doctor = await Staff.findOne({username: req.user.username});
		// Push patient to doctor's patients array and save
    doctor.patients.push(patient);
    await doctor.save();
		res.redirect("/home");
	} catch(err) {
		console.log(err);
	}
});

// Patient SHOW route
router.get("/:patient_id", isLoggedIn, async (req, res) => {
	try {
		// Find patient and populate 6 latest logs
		let patient = await Patient.findOne({_id: req.params.patient_id}).populate({
			path: "logs",
			options: { sort: { createdAt: -1 }, limit: 6 }
		}).exec();
		res.render("patients/show", {patient: patient});
	} catch(err) {
		console.log(err);
	}
});

// Patient EDIT route
router.get("/:patient_id/edit", isLoggedIn, patientPermissions, async (req, res) => {
	try {
		//let patient = await Patient.findOne({_id: req.params.patient_id});
		res.render("patients/edit", {patient: req.patient});
	} catch(err) {
		console.log(err);
	}
});

// Patient UPDATE route
router.put("/:patient_id", isLoggedIn, patientPermissions, async (req, res) => {
	try {
		// Update patient with new data fields
		let updatedPatient = await Patient.findOneAndUpdate({_id: req.params.patient_id}, req.body);
		res.redirect(`/patients/${updatedPatient._id}`);
	} catch(err) {
		console.log(err);
	}
});

// Patient DESTROY route
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

// Middleware
// Check if user is logged in
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
		// Find patient
		let patient = await Patient.findOne({_id: req.params.patient_id});
		// Check if patient is associated to user
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
