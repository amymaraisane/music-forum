var mongoose = require('mongoose');

var albumSchema = new mongoose.Schema({
    name: String,
    artist: String,
    image: String,
    about: String,
    //need to add validation later to ensure its an html string to avoid mongoose cast to object ID error
    //i would like the image to also be an anchor tag to go to the show page. need to figure out how to put image if user doesnt inclde one
    created: {type: Date, default: Date.now},
    //will not appear as a form input, rather will be automatically created when submit button is clicked
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    }
  });
  
  //connect schema to the available mongoose model properties by saving it as an object. use singular capitalized version of name here to avoid confusion
  //mongoose is smart enough to store collection name as plural and lowercase even though convention says to capitalize it here

var Album = mongoose.model("Album", albumSchema);
module.exports = Album;