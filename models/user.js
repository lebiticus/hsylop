// SETUP =======================================================================
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// CONTENT =====================================================================
// Mongoose Schema/Model Config
var userSchema = new mongoose.Schema({
    // email: String,
    name: String,
    password: String,
    profilePicture: String,
})

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

// MODULE EXPORTS ==============================================================
module.exports = User;