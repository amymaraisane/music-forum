var mongoose = require('mongoose');

var commentSchema = ({
    text: String,
    author: String,
});

var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;