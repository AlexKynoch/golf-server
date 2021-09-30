const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: String,
  password: String,
  location: String,
  role: String,
  email: String,
  phone: String,
  availability: Array,
  userNew: Boolean,
  nameFirst: String,
  nameLast: String,
  details: String,
});

module.exports.User = mongoose.model("User", userSchema);
