// Setup =======================================================================
    // npm install express ejs request body-parser mongoose moment method-override --save
    
    // Express
    var express = require("express");
    var app = express();
    
        // Express Sessions
        var session = require("express-session");
        
        app.use(session({
            secret: 'This message is brought to you by Yoyo and Cici!',
            resave: false,
            saveUninitialized: false,
            // cookie: { secure: true }
        }))

    // Fore res.render() files, no need to include .ejs. -------------------
    app.set("view engine", "ejs");
    
    // Allow linking to another directory (called "public") outside immediate. ---------------
    app.use(express.static("public"));

    // Request HTTP
    var request = require("request");
    
    // Receive data through forms
    var bodyParser = require("body-parser");
    app.use(bodyParser.urlencoded({extended: true}));
    
    // Mongoose (Database)
    var mongoose = require("mongoose");
    mongoose.connect("mongodb://localhost/restful_post_app", { useNewUrlParser: true });
    
        // Mongoose Schema/Model Config
        var User = require("./models/user.js");
        var Post = require("./models/post.js");
        var Comment = require("./models/comment.js");
        
    // Moment.js
    var moment = require("moment");
    
    // Method Override (for PUT & DELETE Routes)
    var methodOverride = require("method-override");
    app.use(methodOverride("_method"));
    
    // Database Seeding
    var seedDB = require("./seeds.js");
    seedDB();
    
    // Passport
        var passport = require("passport");
        var LocalStrategy = require("passport-local");
        var passportLocalMongoose = require("passport-local-mongoose");
        
        app.use(passport.initialize());
        app.use(passport.session());
        
        passport.use(new LocalStrategy(User.authenticate()));
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());
        
        app.use(function(req, res, next){
            res.locals.currentUser = req.user;
            next();
        })
    
// =============================================================================
// AUTH Routes 
// =============================================================================    

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});  

// Login
app.get("/login", function(req, res){
    res.render("auth/login");
});

    // Login Logic
    app.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    }) ,function(req, res){
    });
    
// Logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})


// Register
app.get("/register", function(req, res){
    res.render("auth/register");
});

    // Handle User Sign up
    app.post("/register", function(req, res){
        var newUser = new User({username: req.body.username});
        User.register(newUser, req.body.password, function(err, user){
            if (err) {
                console.log(err);
                return res.render("auth/register");
            }
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            });
        });
    });
      
// =============================================================================
// POST Routes 
// =============================================================================

// INDEX Route
app.get("/", function(req, res){
    res.redirect("/posts");
});
app.get("/posts", function(req, res){
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

// NEW Route
app.get("/posts/new", function(req, res){
    res.render("posts/new");
});

    // CREATE Route
    app.post("/posts", function(req, res){
        // Create post
        Post.create(req.body.post, function(err, newPost){
            if (err) {
                res.render("posts/new");
            } else {
                // Then, redirect to the index
                res.redirect("/posts");
            }
        });
    });

// SHOW Route
app.get("/posts/:id", function(req, res){
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
app.get("/posts/:id/edit", function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if (err) {
            res.redirect("/posts");
        } else {
            res.render("posts/edit", {post: foundPost});
        }
    });
});

    // UPDATE Route
    app.put("/posts/:id", function(req, res){
        Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
            if(err){
                res.redirect("/posts");
            }  else {
                res.redirect("/posts/" + req.params.id);
            }
        });
    });

// DELETE Route
app.delete("/posts/:id", function(req, res){
   //destroy post
   Post.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/posts");
       } else {
           res.redirect("/posts");
       }
   })
   //redirect somewhere
});

// =============================================================================
// COMMENT ROUTES
// =============================================================================

// NEW Route
app.get("/posts/:id/comments/new", isLoggedIn, function(req, res){
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
    app.post("/posts/:id/comments", isLoggedIn, function(req, res){
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
                        post.comments.push(comment);
                        post.save();
                        res.redirect("/posts/" + post._id);
                    }
                });
            }
        });
        // Create new comment
        // Connect new comment to post
        // Redirect to post show page
    });

// =============================================================================
// 404 ROUTE
// =============================================================================
    app.get("*", function(req, res){
        res.send("What are you doing here?..")
    })


// Start server ================================================================
app.listen(process.env.PORT, process.env.IP, function(){
  console.log("The RESTfulPostApp server has started.");
});

