var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');


router.get("/", function(req, res) {
  res.render("landing");
});

// =========================
// COMMENT ROUTE
// =========================

// Auth Route
// show register form
router.get("/register", function(req, res) {
  res.render("register");
});
// handel sign up logic
router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});
// Show Login form
router.get("/login", function(req, res) {
  req.flash("error", "Please Log In First");
  res.render("login");
});
// handeling login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), function(req, res) {
});
// Logout route
router.get("/logout", function(req, res) {
  req.logOut();
  req.flash("success", "Logged you out");
  res.redirect("/campgrounds");
});
// MIDDLEWARE
function isloggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;