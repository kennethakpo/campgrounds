var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");


router.get("/",function(req, res){
   res.render("landing"); 
});


//=====================
//Auth Routes
//=====================

//show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});


//handle sign up logic
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            })
    });
});


//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handle login logic with middleware
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
    
});

//handle logout logic
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You are successfully logged out");
    res.redirect("/campgrounds");
});

module.exports = router;