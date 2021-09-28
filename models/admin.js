const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  userName: String,
  password: String,
  location: String,
  role: String,
  email: String,
  phone: String,
  //   availabilty: String,
  nameFirst: String,
  nameLast: String,
});

module.exports.Admin = mongoose.model("Admin", adminSchema);
