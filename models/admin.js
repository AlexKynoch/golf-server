const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
var ObjectId = require("mongodb").ObjectId;

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
  details: String,
  token: { type: ObjectId, required: true },
});

module.exports.Admin = mongoose.model("Admin", adminSchema);
