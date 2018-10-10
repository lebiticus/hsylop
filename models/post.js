// SETUP =======================================================================
var mongoose = require("mongoose");

// CONTENT =====================================================================
// Mongoose Schema/Model Config
var postSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        profilePicture: String,
    },
    title: String,
    image: {type: String, default: "https://images.immediate.co.uk/volatile/sites/3/2017/11/imagenotavailable1-39de324.png"},
    body: String,
    created: {type: Date, default: Date.now},
    comments: [
        // Object Id of Comment
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],
    // votes: {
    //     praise: Number,
    //     encourage: Number,
    // },
});

var Post = mongoose.model("Post", postSchema);

// MODULE EXPORTS ==============================================================
module.exports = Post;