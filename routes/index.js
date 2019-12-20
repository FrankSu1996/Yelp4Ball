var express         = require("express"),
    router          = express.Router(),
    User            = require("../models/user"),
    bcrypt          = require("bcryptjs");

//function to require login for certain get requests
function loginRequired(req, res, next) {
    if(!req.user) {
        return res.redirect("/login");
    }

    return next();
}

//root Route
router.get("/", function(req, res){
    res.render("landing");
});

//Register form route
router.get("/register", function(req, res) {
    res.render("register", {page: "register"});
});

//handle register logic
router.post("/register", (req, res) => {
    //use bcrypt to hash users password
    let hash = bcrypt.hashSync(req.body.password, 14);
    req.body.password = hash;
    let user = new User(req.body);

    //save user in database
    user.save((err) => {
        if(err) {
            var error = "Please make sure all fields are entered correctly!";

            //error if username is already in database
            if(err.code === 11000) {
                error = "That username is already taken, please try another.";
            }
            req.flash("error", error);
            return res.redirect("/register");
        }
        req.flash("success", "Welcome to Yelp4Ball " + user.userName + "!");
        res.redirect("/ballcourts");
    });
});

//show login form route
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});

//handle login logic
router.post("/login", (req, res) => {
    User.findOne({ userName: req.body.userName}, (err, user) => {
        //if login fails, redirect back to login
        if(!user) {
            req.flash("error", "That username does not exist!");
            res.redirect("/login");
        }
        else if (!bcrypt.compareSync(req.body.password, user.password)){
            req.flash("error", "Your password is incorrect! Please try again");
            res.redirect("/login");
        }
        else {
            //store unique id in session object
            req.session.userId = user._id;
            res.redirect("/ballcourts");
        }
    });
});

//logout route
router.get("/logout", function(req, res) {
    req.session.reset();
    req.flash("success", "You have sucessfully logged out!");
    res.redirect("/ballcourts");
});

module.exports = router;