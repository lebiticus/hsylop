// Setup =======================================================================
    // npm install body-parser connect-flash ejs express express-session method-override --save
    // npm install moment mongoose  passport passport-local passport-local-mongoose request --save
    
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
    mongoose.connect("mongodb://localhost/polysh", { useNewUrlParser: true });
    
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
    // seedDB();
    
    // Connect Flash
    var flash = require("connect-flash");
    app.use(flash());
    
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
            // res.locals renders object for all routes
            res.locals.currentUser = req.user;
            res.locals.alertSuccess = req.flash("success");
            res.locals.alertError = req.flash("error");
            next();
        })
    
    
// Routes ======================================================================
var indexRoutes = require("./routes/index");
var postRoutes = require("./routes/posts");
var commentRoutes = require("./routes/comments");

app.use(indexRoutes);
app.use(postRoutes);
app.use(commentRoutes);

// 404 Route
app.get("*", function(req, res){
    res.send("What are you doing here?..")
})


// Start server ================================================================
app.listen(process.env.PORT, process.env.IP, function(){
  console.log("The Polysh server has started.");
});

