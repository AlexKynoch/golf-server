const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema({
    date: String,
    volunteer: String
});


module.exports.Session = mongoose.model("Session", sessionSchema);
