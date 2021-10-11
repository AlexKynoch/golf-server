const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  locationName: String,
  activeCGA: String,
  activeUsers: Array,
  activeVolunteer: Array,
  manager: String,
  details: String,
});

module.exports.Location = mongoose.model("Location", locationSchema);
