// all the middleware goes here
const Campground = require("../models/campground");
const Comment    = require("../models/comment");
let middlewareObj = {};

 // middleware to check campground ownwership
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // does user own the campground ?
                if(foundCampground.author.id.equals(req.user._id)) { // object id & string
                    next();
                } else {
                    req.flash("error", "You dont' have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to proceed.")
        res.redirect("back");
    }
}

// middleware to check campground ownwership
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // does user own the campground
                if(foundComment.author.id.equals(req.user._id)) { // object id & string
                    next();
                } else {
                    req.flash("error", "You need to be logged in to proceed.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to proceed.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to proceed.");
    res.redirect("/login");
}


module.exports = middlewareObj;