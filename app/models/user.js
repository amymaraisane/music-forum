var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    albums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album"
      }
    ]
    //schema must be defined or required earlier in the code so file can reference it when called in a nested object
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
//ok to return/export more than one thing but in our case there is only one model to export