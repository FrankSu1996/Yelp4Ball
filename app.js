require("dotenv").config();

//initial setup
var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    Ballcourt           = require("./models/ballcourt"),
    Comment             = require("./models/comment"),
    seedDB              = require("./seeds"),
    bcrypt              = require("bcryptjs"),
    flash               = require("connect-flash"),
    User                = require("./models/user"),
    methodOverride      = require("method-override");
const sessions          = require("client-sessions");

//obtain routes
var commentRoutes       = require("./routes/comments"),
    ballcourtRoutes     = require("./routes/ballcourts"),
    indexRoutes          = require("./routes/index");

//seed db with ballcourts/comments
//seedDB();

//connect to Mongodb
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp_v5');

//setup app configurations and middlewares
app.use(methodOverride("_method"));
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(sessions({
    cookieName: "session",
    secret: "jfldaisjfa234FDSALIJFAsdlkafj2389472893FDSJALSFEIAJEIFAJafslihaafsf",
    duration: 30 * 60 * 1000,
}));
app.use((req, res, next) => {
    if(!(req.session && req.session.userId)) {
        return next();
    }

    User.findById(req.session.userId, (err, user) => {
        if(err) {
            return next(err);
        }
        
        if(!user) {
            return next();
        }

        user.password = undefined;
        req.user = user;
        res.locals.user = user;

        next();
    });
});
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/ballcourts/:id/comments", commentRoutes);
app.use("/ballcourts", ballcourtRoutes);

app.listen(3000, function() {
    console.log("The YelpCamp Server Has Started!");
});