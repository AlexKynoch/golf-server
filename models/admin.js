const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
var ObjectId = require("mongodb").ObjectId;

const adminSchema = mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: String,
  location: String,
  role: String,
  email: String,
  phone: String,
  //   availabilty: String,
  nameFirst: String,
  nameLast: String,
  details: String,
  // token: { type: uuidv4, required: true },
});

module.exports.Admin = mongoose.model("Admin", adminSchema);
