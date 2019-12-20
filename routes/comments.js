var express         = require("express"),
    router          = express.Router({mergeParams: true}),
    Ballcourt       = require("../models/ballcourt"),
    Comment         = require("../models/comment"),
    middleware      = require("../middleware/index");

//Comments NEW route
router.get("/new", middleware.loginRequired, function(req, res) {
    // find ballcourt by id
    Ballcourt.findById(req.params.id, function(err, ballcourt) {
        if(err) {
            console.log(err);
        }
        else {
            res.render("comments/new", {ballcourt: ballcourt});
        }
    });
});

//Comments CREATE route
router.post("/", middleware.loginRequired, function(req, res) {
    //lookup ballcourt using ID
    Ballcourt.findById(req.params.id, function(err, ballcourt) {
        if(err) {
            console.log(err);
            res.redirect("/ballcourts");
        }
        else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash("error", "Something went wrong...");
                    console.log(err);
                }
                else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.userName = req.user.userName;
                    comment.save();
                    //connect new comment to ballcourt and redirect to ballcourt
                    ballcourt.comments.push(comment);
                    ballcourt.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/ballcourts/" + ballcourt._id);
                }
            });
        }
    });
});

// EDIT comment route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        }
        else {
            res.render("comments/edit", {ballcourt_id: req.params.id, comment: req.comment});
        }
    });
});

// UPDATE comment route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        }
        else {
            res.redirect("/ballcourts/" + req.params.id);
        }
    });
});

// DESTROY comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment deleted!");
            res.redirect("/ballcourts/" + req.params.id);
        }
    });
});

module.exports = router;