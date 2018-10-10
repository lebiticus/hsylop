// SETUP =======================================================================
var mongoose = require("mongoose");

// CONTENT =====================================================================
// Mongoose Schema/Model Config
var commentSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        profilePicture: String,
    },
    body: String,
    created: {type: Date, default: Date.now},
});

var Comment = mongoose.model("Comment", commentSchema);

// MODULE EXPORTS ==============================================================
module.exports = Comment;