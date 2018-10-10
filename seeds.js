// SETUP =======================================================================
var mongoose = require("mongoose");
var Post = require("./models/post.js");
var Comment = require("./models/comment.js");

// CONTENT =====================================================================
// Data
var data = [
    {
    title: "Hewyo",
    image: "https://images.unsplash.com/photo-1532397476918-0b485c271c7f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e3756f0d3bf313fc3a99e0bfea2bdcb9&auto=format&fit=crop&w=1050&q=80",
    body: ":3",
    },
    {
    title: "'Sup",
    image: "https://images.unsplash.com/photo-1508946621775-9d59b75e074e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2c7b085d9d776ecdd4d0b103fbef607d&auto=format&fit=crop&w=1050&q=80",
    body: "<w<",
    },
    {
    title: "Who you?",
    image: "https://images.unsplash.com/photo-1512766566685-f76f30b57da2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0819edf1e1768686193439d9a2a06b98&auto=format&fit=crop&w=634&q=80",
    body: ".w.",
    },
]

// Seed
function seedDB(){
    // Remove all posts
    Post.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("Removed posts!");
            // Add a few posts
            data.forEach(function(seed){
                Post.create(seed, function(err, post){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("New post was made!");
                        // Create a comment;
                        Comment.create({
                            author: "User",
                            body: "Awwwwwwwwww"
                        }, function (err, comment){
                            if (err) {
                                console.log(err);
                            } else {
                                post.comments.push(comment);
                                post.save();
                                console.log("You created a comment!");
                            }
                        });
                    }
                });
            });
        }
    });

    
    
    // Add a few comments
    
}



// MODULE EXPORTS ==============================================================
module.exports = seedDB;