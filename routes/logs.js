const Staff = require("../models/staff");
const Patient = require("../models/patient");
const Log = require("../models/log");
const express = require("express");
const router = express.Router();

router.post("/new", async (req, res) => {
  console.log("New log");
});

router.get("/:log_id/edit", async (req, res) => {
  console.log("GET edit log");
});

router.put("/:log_id", async (req, res) => {
  console.log("PUT edit log");
});

router.delete("/:log_id", async (req, res) => {
  console.log("Delete log");
});

module.exports = router;
