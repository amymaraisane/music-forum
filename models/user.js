var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    albums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album"
      }
    ]
    //schema must be defined or required earlier in the code so file can reference it when called in a nested object
});

var User= mongoose.model("User", userSchema);
module.exports = User;
//ok to return/export more than one thing but in our case there is only one model to export