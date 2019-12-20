var mongoose    = require("mongoose");
var ballCourt  = require("./models/ballcourt");
var Comment     = require("./models/comment");

var data = [
    {
        name: "Tryhard Valley", 
        image: "https://ak0.picdn.net/shutterstock/videos/6185630/thumb/1.jpg",
        description: "Great place to get destroyed by seasoned veterans!"
    },
    {
        name: "LeBron's Backyard", 
        image: "https://i.pinimg.com/originals/09/9e/b3/099eb35ec28c190828ae24953a7120ec.jpg",
        description: "TACOOOOOO TUEEEEESDAY!!!"
    },
    {
        name: "KD's Burner Court", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsC4WMJXSA1TdOhJuieH9NkKYUEoyw3sWgJh9azksb98lSgkIy&s",
        description: "Careful, bring protective clothing. Frequent snake appearances."
    }
]
 
function seedDB(){
   //Remove all ballcourts
   ballCourt.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed ballcourts!");
        Comment.deleteMany({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few ballcourts
            data.forEach(function(seed){
                ballCourt.create(seed, function(err, ballcourt){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a BallCourt");
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;