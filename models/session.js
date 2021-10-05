const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema({
  date: String,
  volunteer: String,
  sessionUsers: Array,
  sessionLocation: String,
  sessionTimeStart: String,
  sessionTimeFinish: String,
  userLimit: Number,
  details: String,
});

module.exports.Session = mongoose.model("Session", sessionSchema);
