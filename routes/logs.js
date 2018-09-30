const Staff = require("../models/staff");
const Patient = require("../models/patient");
const Log = require("../models/log");
const express = require("express");
const router = express.Router({mergeParams: true});

//middleware to check if user is logged in
function isLoggedIn(req,res, next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect("/");

}

router.post("/", isLoggedIn, async (req, res) => {
  try {
    let patient = await Patient.findOne({_id: req.params.patient_id});
    let log = await Log.create(req.body);
    patient.logs.push(log);
    await patient.save();
    res.redirect(`/patients/${req.params.patient_id}`);
  } catch(err) {
    console.log(err);
  }
});

router.get("/:log_id/edit", isLoggedIn, async (req, res) => {
  try {
    let patient = await Patient.findOne({_id: req.params.patient_id});
    let log = await Log.findOne({_id: req.params.log_id});
    res.render("logs/edit", {patient: patient, log: log});
  } catch(err) {
    console.log(err);
  }
});

router.put("/:log_id", isLoggedIn, async (req, res) => {
  try {
    let patient = await Patient.findOne({_id: req.params.patient_id});
    let log = await Log.findOneAndUpdate({_id: req.params.log_id}, req.body);
    res.redirect(`/patients/${req.params.patient_id}`);
  } catch(err) {
    console.log(err);
  }
});

router.delete("/:log_id", isLoggedIn, async (req, res) => {
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

module.exports = router;
