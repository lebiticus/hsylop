// SETUP =======================================================================
var express = require("express");
var router = express.Router({mergeParams:true});
var passport = require("passport");
var moment = require("moment");

var User = require("../models/user.js");
var Post = require("../models/post.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware");

// =============================================================================
// POST Routes 
// =============================================================================

// NEW Route
router.get("/posts/new", middleware.isLoggedIn, function(req, res){
    res.render("posts/new");
});

    // CREATE Route
    router.post("/posts", middleware.isLoggedIn, function(req, res){
        // console.log(req.user);
        // Create post
        Post.create(req.body.post, function(err, newPost){
            if (err) {
                res.render("posts/new");
            } else {
                // Add Username and ID to newPost
                newPost.author.id = req.user._id;
                newPost.author.username = req.user.username;
                newPost.author.profilePicture = req.user.profilePicture;
                // Save Post
                newPost.save();
                // console.log(newPost);
                // Then, redirect to the index
                res.redirect("/posts/" + newPost._id);
            }
        });
    });

// SHOW Route
router.get("/posts/:id", function(req, res){
    // FIND POST, POPULATE / LOOK INTO "COMMENTS", START QUERY OF "COMMENTS" ===
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if (err) {
            res.redirect("/posts");
        } else {
            res.render("posts/show", {
                post: foundPost, 
                moment: moment,
            });  
        }
    });
});

// EDIT Route
router.get("/posts/:id/edit", middleware.checkPostOwnership, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if (err) {
            res.redirect("/posts");
        } else {
        res.render("posts/edit", {post: foundPost});
        }
    });
});

    // UPDATE Route
    router.put("/posts/:id", middleware.checkPostOwnership, function(req, res){
        Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, foundPost){
            if(err){
                res.redirect("/posts");
            }  else {
                res.redirect("/posts/" + req.params.id);
            }
        });
    });

// DELETE Route
router.delete("/posts/:id", middleware.checkPostOwnership, function(req, res){
   // Destroy post
   Post.findByIdAndRemove(req.params.id, function(err, foundPost){
       if(err){
            res.redirect("/posts");
       } else {
            res.redirect("/posts");
       }
   });
});

// MIDDLEWARE (Original) =======================================================
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkPostOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         Post.findById(req.params.id, function(err, foundPost){
//             if (err) {
//                 res.redirect("/posts");
//             } else {
//                 // Does user own the campground?
//                 // .equals() is mongoose method that can compare objects with strings
//                 if (req.user._id.equals(foundPost.author.id)) {
//                     // If so, move on
//                     next();
//                 } else {
//                     // If not, redirect
//                     res.redirect("back");
//                 }
//             }
//     });
//     } else {
//     res.redirect("back");
//     }
// }


// MODULE EXPORTS ==============================================================
module.exports = router;