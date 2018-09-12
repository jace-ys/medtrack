const Staff = require("../models/staff");
const Patient = require("../models/patient");
const Log = require("../models/log");
const express = require("express");
const router = express.Router({mergeParams: true});

router.post("/", async (req, res) => {
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

router.get("/:log_id/edit", async (req, res) => {
  res.render("logs/edit");
});

router.put("/:log_id", async (req, res) => {
  console.log("PUT edit log");
});

router.delete("/:log_id", async (req, res) => {
  console.log("Delete log");
});

module.exports = router;
