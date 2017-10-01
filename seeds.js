var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");

var campgroundData = [
    {
     name: "Cloud's Rest",
     image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg",
     description: "blah blah blah"
    },
    {
     name: "Desert Mesa",
     image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
     description: "blah blah blah"
    },
    {
     name: "Canyon Floor",
     image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg",
     description: "blah blah blah"
    }
]

function SeedDB(){
    //Remove all campgrounds
    Campground.remove({},function(err){
        if(err){
            console.log("ERROR Occured");
        }else{
            console.log("Campgrounds Removed");
            
            //Add a few Campgrounds
            campgroundData.forEach(function(campgroundDataItem){
                Campground.create(campgroundDataItem, function(err,campground){
                    if(err){
                        console.log("ERROR Occured");
                    }else{
                        console.log("Added a campground");
                        
                        //create comments
                        Comment.create({
                            text: "Nice campsite but I wish they had internet",
                            author: "Trump"
                            },
                            function(err, comment){
                                if(err){
                                    console.log(err);
                                }else{
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created New Comment");
                                }
                        });
                    }
                });
            });
            
            
        }
    });
    
    
}

module.exports = SeedDB;