const express = require("express");
let router = express.Router();
const passport = require("passport");
let User = require("../models/user");

// root route
router.get("/", (req, res) => {
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res){
    // res.send("Signing you up...");
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login");
});

// handling login logic
// router.post("/login", middleware, callback) -- syntax
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to YelpCamp!'
    }), function(req,  res){
});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged out!");
    res.redirect("/campgrounds");
})

module.exports = router;