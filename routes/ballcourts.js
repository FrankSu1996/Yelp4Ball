var express = require("express");
var router = express.Router();
var Ballcourt = require("../models/ballcourt");
var middleware = require("../middleware/index");
var NodeGeocoder = require("node-geocoder");

var options = {
    provider: "google",
    httpAdapter: "https",
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);

//INDEX route - show all ballcourts
router.get("/", function(req, res) {
    //get all ballcourts from DB
    Ballcourt.find({}, function(err, allBallcourts) {
        if(err) {
            console.log(err);
        }
        else {
            res.render("ballcourts/index", {ballcourts:allBallcourts, currentUser: req.user, page: "ballcourts"});
        }
    });
});

//CREATE route - add new ballcourt to DB
router.post("/", middleware.loginRequired, function(req, res) {
    //get data from form and add to ballcourts array
    var name = req.body.name;
    var imgUrl = req.body.image;
    var numberPlaying = req.body.numberPlaying;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        userName: req.user.userName
    }

    geocoder.geocode(req.body.location, function(err, data) {
        if(err || !data.length) {
            req.flash("error", "Invalid address");
            return res.redirect("back");
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCourt = {name: name, image: imgUrl, description: description, author: author, numberPlaying: numberPlaying,
                        location: location, lat: lat, lng: lng};
        //create new ballcourt and save to db
        Ballcourt.create(newCourt, function(err, newlyCreated) {
            if(err) {
                console.log(err);
            }
            else {
                //redirect back to ballcourts page
                res.redirect("ballcourts");
            }
        });
    });
});

//NEW route - show form to create new ballcourt
router.get("/new", middleware.loginRequired, function(req, res) {
    res.render("ballcourts/new");
});

//SHOW route - show information about particular ballcourt
router.get("/:id", function(req, res) {
    //find ballcourts with provided id, populate comment reference with comment
    Ballcourt.findById(req.params.id).populate("comments").exec(function(err, foundCourt) {
        if(err || !foundCourt) {
            req.flash("error", "Sorry. that ballcourt does not exist!");
            return res.redirect("/ballcourts");
        }
        else {
            res.render("ballcourts/show", {ballcourt: foundCourt});
        }
    });
});

//EDIT ballcourt route
router.get("/:id/edit", middleware.checkBallcourtOwnership, function(req, res) {
    //is user logged in
    Ballcourt.findById(req.params.id, function(err, foundBallcourt) {
        res.render("ballcourts/edit", {ballcourt: foundBallcourt});
    });
});

//EDIT only number of people playing
router.get("/:id/editNumberPlaying", middleware.loginRequired, function(req, res) {
    //is user logged in
    Ballcourt.findById(req.params.id, function(err, foundBallcourt) {
        res.render("ballcourts/editNumberPlaying", {ballcourt: foundBallcourt});
    });
});

//UPDATE ballcourt route
router.put("/:id", middleware.loginRequired, function(req, res) {
    //case for users only updating number of people playing
    if(!req.body.location) {
        Ballcourt.findById(req.params.id, function(err, foundCourt) {
            var newCourt = foundCourt;
            newCourt.numberPlaying = req.body.ballcourt.numberPlaying;
            Ballcourt.findByIdAndUpdate(req.params.id, newCourt, function(err, updatedCourt) {
                if(err) {
                    res.redirect("/ballcourts");
                }
                else {
                    res.redirect("/ballcourts/" + req.params.id);
                }
            });
        });
    }
    else {
        geocoder.geocode(req.body.location, function(err, data) {
            if(err || !data.length) {
                req.flash("error", "Invalid address");
                return res.redirect("back");
            }
            req.body.ballcourt.lat = data[0].latitude;
            req.body.ballcourt.lng = data[0].longitude;
            req.body.ballcourt.location = data[0].formattedAddress;
    
            //find and update the correct ballcourt
            Ballcourt.findByIdAndUpdate(req.params.id, req.body.ballcourt, function(err, updatedCourt) {
                if(err) {
                    res.redirect("/ballcourts");
                }
                else {
                    res.redirect("/ballcourts/" + req.params.id);
                }
            });
        });
    }
});

//DESTROY ballcourt route
router.delete("/:id", middleware.checkBallcourtOwnership, function(req, res) {
    Ballcourt.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/ballcourts");
        }
        else {
            res.redirect("/ballcourts");
        }
    });
});

module.exports = router;