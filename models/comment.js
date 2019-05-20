var mongoose = require('mongoose');

var commentSchema = ({
    email: String,
    body: String,
});

var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;