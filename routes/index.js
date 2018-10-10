// SETUP =======================================================================
var express = require("express");
var router = express.Router({mergeParams:true});
var passport = require("passport");
var moment = require("moment");

var User = require("../models/user.js");
var Post = require("../models/post.js");
var Comment = require("../models/comment.js");

// =============================================================================
// AUTH Routes 
// =============================================================================    

// Login Status
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

router.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});  

// Login
router.get("/login", function(req, res){
    res.render("auth/login");
});

    // Login Logic
    router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    }) ,function(req, res){
    });
    
// Logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You are logged out");
    res.redirect("/posts");
});


// Register
router.get("/register", function(req, res){
    res.render("auth/register");
});

    // Handle User Sign up
    router.post("/register", function(req, res){
        var newUser = new User({username: req.body.username, profilePicture: req.body.profilePicture});
        User.register(newUser, req.body.password, function(err, user){
            if (err) {
                // console.log(err.message);
                req.flash("error", err.message);
                return res.redirect("/register");
            }
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to Polysh, " + user.username + "!");
                res.redirect("/posts");
            });
        });
    });
    
// =============================================================================
// Root ROUTES
// =============================================================================

// INDEX Route
router.get("/", function(req, res){
    res.redirect("/posts");
});
router.get("/posts", function(req, res){
    // View all posts
    Post.find({}, function(err, posts){
        if (err) {
            console.log(err);
        } else {
            res.render("posts/index", {
                posts: posts, 
                moment: moment,
                currentUser: req.user,
            });
        }
    });
});
    
// MODULE EXPORTS ==============================================================
module.exports = router;