var express         = require("express"),
    router          = express.Router(),
    User            = require("../models/user"),
    bcrypt          = require("bcryptjs"),
    crypto          = require("crypto"),
    async           = require("async"),
    nodemailer      = require("nodemailer"),
    middleware      = require("../middleware/index");

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

//forgot password
router.get("/forgot", middleware.loginRequired, function(req, res) {
    res.render("forgot");
});

router.post("/forgot", function(req, res, next) {
    console.log(process.env.GMAILPW);
    async.waterfall([
        function(done) {
        crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
        });
    },
    function(token, done) {
        User.findOne({email: req.body.email}, function(err, user) {
            if(!user) {
                req.flash("error", "No account with that email address exists.");
                return res.redirect("/forgot");
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; //1 hour

            user.save(function(err) {
                done(err, token, user);
            });
        });
    },
    function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'yelp4ballinfo@gmail.com',
                pass: process.env.GMAILPW
            }
        });
        var mailOptions = {
            to: user.email,
            from: "yelp4ballinfo@gmail.com",
            subject: "Password Reset",
            text: "You are receiving this email because you (or someone else) have requested the reset of the password. " + 
                    "Please click on the following link, or paste this into your browser to complete the process. " + 
                    "http://" + req.headers.host + "/reset/" + token + "\n\n" + 
                    "If you did not request this, please ignore this email and your password will remain unchanged."
        };
        smtpTransport.sendMail(mailOptions, function(err) {
            console.log("mail sent");
            req.flash("success", "An email has been sent to " + user.email + " with further instructions.");
            done(err, "done");
        });
    }
    ], function(err) {
        if(err) return next(err);
        res.redirect("/forgot");
    });
});

//get the password reset page
router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
});

router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect("/ballcourts");
          }
          if(req.body.password === req.body.confirm) {
              let hash = bcrypt.hashSync(req.body.password, 14);
              user.password = hash;
              user.save((err) => {
                if(err) {
                    req.flash("error", "Oops, something went wrong!!");
                    console.log(err);
                }
              });
              done(err, user);
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'yelp4ballinfo@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'yelp4ballinfo@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/ballcourts');
    });
});

module.exports = router;