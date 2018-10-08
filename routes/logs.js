// Require dependencies
const Staff = require("../models/staff");
const Patient = require("../models/patient");
const Log = require("../models/log");
const express = require("express");
const router = express.Router({mergeParams: true});

// Log CREATE route
router.post("/", isLoggedIn, async (req, res) => {
  try {
    // Create newLog object
    let newLog = req.body;
    // Associate to doctor
    newLog.submittedBy = {
      id: req.user._id,
      name: req.user.name
    }
    // Create log in database
    let log = await Log.create(newLog);
    // Find associated patient
    let patient = await Patient.findOne({_id: req.params.patient_id});
    // Push log to patient's logs array and save
    patient.logs.push(log);
    await patient.save();
    res.redirect(`/patients/${req.params.patient_id}`);
  } catch(err) {
    console.log(err);
  }
});

// Log EDIT route
router.get("/:log_id/edit", isLoggedIn, logPermissions, async (req, res) => {
  try {
    // Find patient
    let patient = await Patient.findOne({_id: req.params.patient_id});
    //let log = await Log.findOne({_id: req.params.log_id});
    res.render("patient_logs/edit", {patient: patient, log: req.log});
  } catch(err) {
    console.log(err);
  }
});

// Log UPDATE route
router.put("/:log_id", isLoggedIn, logPermissions, async (req, res) => {
  try {
    // Update log with new data fields
    let log = await Log.findOneAndUpdate({_id: req.params.log_id}, req.body);
    res.redirect(`/patients/${req.params.patient_id}`);
  } catch(err) {
    console.log(err);
  }
});

// Log DESTROY route
router.delete("/:log_id", isLoggedIn, logPermissions, async (req, res) => {
  try {
    // Remove log from patient's list of logs
    await Patient.findOneAndUpdate({_id: req.params.patient_id}, { $pull:
      { logs: req.params.log_id }
    });
    // Delete log
    await Log.deleteOne({_id: req.params.log_id});
    res.redirect(`/patients/${req.params.patient_id}`);
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

// Check log permissions
async function logPermissions(req, res, next) {
	try {
    // Find log
		let log = await Log.findOne({_id: req.params.log_id});
    // Check if log is associated to user
		if(log.submittedBy.id.equals(req.user._id)) {
      req.log = log;
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
