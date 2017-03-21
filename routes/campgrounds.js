var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

// Index Route Show all Campgground
router.get("/", function(req, res) {
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});
// "Create" route to create campgrounds and save it ot the database
router.post("/", middleware.isloggedIn, function(req, res) {
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, price: price, image: image, description: desc, author: author};
  // Create new campgrounds
  Campground.create(newCampground, function(err, newlyCreatedCamp) {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreatedCamp)
      res.redirect("/campgrounds");
    }
  });
});
// "NEW" route show form to create new campground
router.get("/new", middleware.isloggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// "Show" route to show one item description at a  time
router.get("/:id", function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});
// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkOwnerShip, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render('campgrounds/edit', {campground: foundCampground});
  });
});

//UPDATE CAMPGROUND ROUTE 
router.put('/:id', middleware.checkOwnerShip, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkOwnerShip, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});


// MIDDLEWARE

// Check for user ownership of the campground

module.exports = router;