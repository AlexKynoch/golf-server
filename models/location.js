const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  locationName: String,
  activeCGA: String,
  activeUsers: Array,
  activeVolunteer: Array,
  manager: String,
});

module.exports.Location = mongoose.model("Location", locationSchema);
