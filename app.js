var express         = require("express");
var app             = express();
var bodyParser      = require("body-parser");
var mongoose        = require("mongoose");
var flash           = require("connect-flash");
var methodOverride  = require("method-override");
var passport        = require("passport");
var localStrategy   = require("passport-local");


var Campground      = require("./models/campground");
var Comment         = require("./models/comment");
var User            = require("./models/user");
var SeedDB          = require("./seeds");

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");

app.locals.moment = require("moment");

//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://kenneth:kenneth@ds155634.mlab.com:55634/akpos_yelpcamp");

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(flash());

//SeedDB();

//PASSPORT Configuration
app.use( require("express-session")({
    secret: "This is the beginning of kungfukenny",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Add current user to all templates in a currentUser Object and 
//Add message to all template which contains flash message
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Tell app to use routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp is online");
});