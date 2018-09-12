const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
  submittedBy: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff"
    },
    name: String
  }
});

module.exports = mongoose.model("Log", logSchema);
