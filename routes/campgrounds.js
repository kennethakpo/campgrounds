var express = require("express");
var router = express.Router();
var geocoder = require("geocoder");
var Campground = require("../models/campground");
var middleware = require("../middleware");



//INDEX route: Show all campgrounds (/campgrounds) - GET
router.get("/", function(req, res){
    
    Campground.find({},function(err,campgrounds){
        if(!err){
            res.render("campgrounds/index", {campgrounds : campgrounds, page: 'campgrounds'});
        }
    });
    
});

//CREATE : Add new campground to database (/campgrounds) - POST
router.post("/", middleware.isLoggedIn, function(req, res){
    
    // get data from form and add to campgrounds array
      var name = req.body.name;
      var image = req.body.image;
      var desc = req.body.description;
      var author = {
          id: req.user._id,
          username: req.user.username
      }
      var price = req.body.price;
      geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
    
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
    
});

//NEW : Show form to create new campground(/campgrounds/new) - GET
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW: Show details of the campground(/campground/:id) - GET 
router.get("/:id", function(req, res){
    var campgroundId = req.params.id;
    Campground.findById(campgroundId).populate("comments").exec(function(err, foundCampground){
        if(!err){
            res.render("campgrounds/show",{campground : foundCampground });
        }
    });
});

//EDIT : Show form to edit campground info (/campgrounds/:id/edit) - GET
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        
    Campground.findById(req.params.id, function(err, foundCampground){
            
        res.render("campgrounds/edit", {campground: foundCampground});
            
    });
});
        

//UPDATE: where the Edit form submits to (/campgrounds/:id) - PUT using method override (?_method=PUT)
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

//DELETE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        
        req.flash("success", "Compground successfully deleted");
        res.redirect("/campgrounds");
        
    })
});



module.exports = router;
