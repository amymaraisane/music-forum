var middlewareObj = {};
    Album = ("../models/album");
    Comment = ("../models/comment");

middlewareObj.isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    //will not display unless "error" key is called in the route below
    res.redirect("/login"); 
}

middlewareObj.checkAlbumOwnership = (req, res, next)=>{
    if(req.isAuthenticated()){ 
        var albumID = req.params.id;
        Album.findById(albumID, (err, album)=>{
        if(err || !album){
            req.flash("error", "Album not found");
            res.redirect("/music");
        } else{
            //ensure user created the album
            //once found, album is a mongoose object despite looking like a string when printed
            //req.user._id is a string. need to use.equals method to check equality
            if(album.author.id.equals(req.user._id) || req.user.isAdmin){
            req.album = album;
            next();
            } else{
            req.flash("error", "You don't have permission to do that");
            res.redirect("/albums/" + req.params.albumID);
            }
        }
        });  
    } else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next)=>{
    if(req.isAuthenticated()){ 
      var commentID = req.params.comment_id;
      Comment.findById(commentID, (err, comment)=>{
        if(err || !comment){
          req.flash("error", "Comment not found");
          res.redirect("/music");
        } else if(comment.author.id.equals(req.user._id) || req.user.isAdmin){
            next();
          //ensure user created the album
          //once found, album is a mongoose object despite looking like a string when printed
          //req.user._id is a string. need to use.equals method to check equality
          } else{
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
          }
        });  
    } else{
      req.flash("error", "You need to be logged in to do that");
      res.redirect("back");
    }
}

module.exports = middlewareObj;