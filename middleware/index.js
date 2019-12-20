var Ballcourt = require("../models/ballcourt"),
    Comment   = require("../models/comment");

// all middleware goes here
var middlewareObj = {};

//middleware function to check if current user logged in owns a ballcourt post
middlewareObj.checkBallcourtOwnership = function(req, res, next) {
    //is user logged in
    if(req.user) {
        Ballcourt.findById(req.params.id, function(err, foundBallcourt) {
            if(err || !foundBallcourt) {
                req.flash("error", "Campground not found!");
                res.redirect("/ballcourts");
            }
            else if(foundBallcourt.author.id.equals(req.user._id)) {
                req.ballcourt = foundBallcourt;
                next();
            }
            else {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

//middleware function to check if current user logged in owns a comment
middlewareObj.checkCommentOwnership = function(req, res, next) {
    //is user logged in
    if(req.user) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err || !foundComment) {
                req.flash("error", "Comment does not exist!");
                res.redirect("/ballcourts");
            }
            else if(foundComment.author.id.equals(req.user._id)) {
                req.comment = foundComment;
                next();
            }
            else {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

//middleware function to require login
middlewareObj.loginRequired = function(req, res, next) {
    if(!req.user) {
        req.flash("error", "You need to be logged in to do that!");
        return res.redirect("/login");
    }
    return next();
}

module.exports = middlewareObj;