var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

router.get("/new",middleware.isloggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});
// Edit comment 
router.get('/:comment_id/edit', middleware.checkCommentOwnerShip, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
    }
  });
});

// Update Comment
router.put('/:comment_id', middleware.checkCommentOwnerShip, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect('/back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// CREATE COMMENT ROUTE
router.post("/", middleware.isloggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds")
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // comment.dateCreated = moment().subtract('days', 7).fromNow();
          comment.save();
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          res.redirect('/campgrounds/'+ campground._id);
        }
      });
    }
  });
});

// COMMENT DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnerShip, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// MIDDLE WARE

module.exports = router;