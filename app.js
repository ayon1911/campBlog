var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    methodOverride  = require('method-override'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    flash           = require('connect-flash');
    seedDB          = require("./seeds");

var commentRoutes     = require('./routes/comments'),
    campgroundRoutes  = require('./routes/campgrounds'),
    indexRoutes       = require('./routes/index');    

mongoose.connect("mongodb://localhost/yelp_camp_Final");
// seedDB();

// Passport Configuration
app.use(require('express-session')({
  secret: "Once again rusty is the cutest dog",
  resave: false,
  saveUninitialized: false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());  



app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
  
  


// Schema Setup


// Campground.create(
//   {name: "Granite Hill",
//   image: "https://farm6.staticflickr.com/5187/5623797406_ea91016ac3.jpg",
//   description: "Granite Hill is beautiful, no oilet no warm water but its good"
//   },
//   function(err, campground) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log("NEwly created campground");
//     console.log(campground);
//   }
// });


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);

app.listen(3000, function() {
  console.log("YelpCamp has Started");
});