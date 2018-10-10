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
// COMMENT ROUTES
// =============================================================================

// NEW Route
router.get("/posts/:id/comments/new", middleware.isLoggedIn, function(req, res){
    // Find post by id
    Post.findById(req.params.id, function (err, post){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {post: post});
        }
    })
});

    // CREATE Route
    router.post("/posts/:id/comments", middleware.isLoggedIn, function(req, res){
        // Lookup post using ID
        Post.findById(req.params.id, function(err, post){
            if (err) {
                console.log(err);
                res.redirect("/posts");
            } else {
                Comment.create(req.body.comment, function(err, comment){
                    if (err) {
                        console.log(err);
                    } else {
                        // Add Username and ID to comment
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.author.profilePicture = req.user.profilePicture;
                        // Save Comment
                        comment.save();
                        post.comments.push(comment);
                        post.save();
                        // console.log(comment);
                        res.redirect("/posts/" + post._id);
                    }
                });
            }
        });
        // Create new comment
        // Connect new comment to post
        // Redirect to post show page
    });

// // EDIT Route
// router.get("/posts/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
//     Post.findById(req.params.id, function(err, foundPost){
//         if (err) {
//             res.redirect("/posts");
//         } else {
//         res.render("posts/edit", {post: foundPost});
//         }
//     });
// });

// DELETE Route
router.delete("/posts/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
  // Destroy comment
  Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment){
      if(err){
            res.redirect("/posts");
      } else {
            req.flash("success", "Comment deleted");
            res.redirect("/posts/" + req.params.id);
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

// function checkCommentOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//             if (err) {
//                 res.redirect("/posts");
//             } else {
//                 // Does user own the campground?
//                 // .equals() is mongoose method that can compare objects with strings
//                 if (req.user._id.equals(foundComment.author.id)) {
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