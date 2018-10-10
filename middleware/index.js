var Post = require("../models/post");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

// LOGIN =======================================================================
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first");
    res.redirect("/login");
};

// POSTS =======================================================================
middlewareObj.checkPostOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Post.findById(req.params.id, function(err, foundPost){
            if (err) {
                res.redirect("/posts");
            } else {
                // Does user own the campground?
                // .equals() is mongoose method that can compare objects with strings
                if (req.user._id.equals(foundPost.author.id)) {
                    // If so, move on
                    next();
                } else {
                    // If not, redirect
                    res.redirect("back");
                }
            }
    });
    } else {
    res.redirect("back");
    }
};

// COMMENTS ====================================================================
middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                res.redirect("/posts");
            } else {
                // Does user own the campground?
                // .equals() is mongoose method that can compare objects with strings
                if (req.user._id.equals(foundComment.author.id)) {
                    // If so, move on
                    next();
                } else {
                    // If not, redirect
                    res.redirect("back");
                }
            }
    });
    } else {
    res.redirect("back");
    }
};

// EXPORT ======================================================================
module.exports = middlewareObj;