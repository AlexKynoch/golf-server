const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
var ObjectId = require("mongodb").ObjectId;

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
  // token: { type: ObjectId, required: true },
});

module.exports.User = mongoose.model("Users", userSchema);
