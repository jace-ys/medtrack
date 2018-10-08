const Staff = require("../models/staff");
const Patient = require("../models/patient");
const Log = require("../models/log");
const express = require("express");
const router = express.Router({mergeParams: true});

router.post("/", isLoggedIn, async (req, res) => {
  try {
    let newLog = req.body;
    newLog.submittedBy = {
      id: req.user._id,
      name: req.user.name
    }
    let patient = await Patient.findOne({_id: req.params.patient_id});
    let log = await Log.create(newLog);
    patient.logs.push(log);
    await patient.save();
    res.redirect(`/patients/${req.params.patient_id}`);
  } catch(err) {
    console.log(err);
  }
});

router.get("/:log_id/edit", isLoggedIn, logPermissions, async (req, res) => {
  try {
    let patient = await Patient.findOne({_id: req.params.patient_id});
    //let log = await Log.findOne({_id: req.params.log_id});
    res.render("patient_logs/edit", {patient: patient, log: req.log});
  } catch(err) {
    console.log(err);
  }
});

router.put("/:log_id", isLoggedIn, logPermissions, async (req, res) => {
  try {
    let log = await Log.findOneAndUpdate({_id: req.params.log_id}, req.body);
    res.redirect(`/patients/${req.params.patient_id}`);
  } catch(err) {
    console.log(err);
  }
});

router.delete("/:log_id", isLoggedIn, logPermissions, async (req, res) => {
  try {
    await Patient.findOneAndUpdate({_id: req.params.patient_id}, { $pull:
      { logs: req.params.log_id }
    });
    await Log.deleteOne({_id: req.params.log_id});
    res.redirect(`/patients/${req.params.patient_id}`);
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

async function logPermissions(req, res, next) {
	try {
		let log = await Log.findOne({_id: req.params.log_id});
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
