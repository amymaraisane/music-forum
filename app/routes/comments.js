var express =   require('express');
    router =    express.Router({mergeParams: true});
    Album =     require("../models/album");
    request =   require('request');
    Comment =   require("../models/comment");
    User =      require("../models/user");
    middlewareObj = require("../middleware");

//Comments NEW route
router.get('/new', middlewareObj.isLoggedIn, (req, res)=>{
    Album.findById(req.params.id, (err, album)=>{
      if (err){
        req.flash("error", "This site is experiencing maintenance. Be back soon!");
        res.redirect('/comments');
      } else {
        res.render('comments/new', {album: album});
      }
    });
});
  
//Comments CREATE route
router.post('/', middlewareObj.isLoggedIn, (req, res)=>{
    let newComment= req.body.comment;
    Album.findById(req.params.id, (err, album)=>{
      if (err || !album){
        req.flash("error", "Album not found");
      } else{
        newComment.text = req.sanitize(newComment.text);
        Comment.create(newComment, (err, comment)=>{
          if (err){
            req.flash("error", "This site is experiencing maintenance. Be back soon!");
          } else { 
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            album.comments.push(comment);
            album.save((err, data)=>{
              if (err){
                req.flash("error", "This site is experiencing maintenance. Be back soon!");
              }
            });
            req.flash("success", "Comment added!");
            res.redirect('/music/' + album._id);
          }
        });
      }
    });
});

//Comments EDIT Route
router.get('/:comment_id/edit', middlewareObj.isLoggedIn, middlewareObj.checkCommentOwnership, (req, res)=>{
  res.render('comments/edit', {album_id: req.params.id, comment: req.comment});
});

//Comments UPDATE route
router.put('/:comment_id', middlewareObj.checkCommentOwnership, (req, res)=>{
  var data = req.body.comment;
  console.log(data);
  Comment.findByIdAndUpdate(req.params.comment_id, data, (err, updatedComment)=>{
    if(err || !updatedComment){
      req.flash("error", "This site is experiencing maintenance. Be back soon!");
      res.redirect("back");
    } else{
      req.flash("success", "Comment updated!");
      res.redirect("/music/" + req.params.id);
    }
  });
});

//Comments Destroy Route
router.delete('/:comment_id', middlewareObj.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndRemove(req.params.comment_id, err=>{
    if (err){
      req.flash("error", "This site is experiencing maintenance. Be back soon!");
      res.redirect("back");
    } else{
      req.flash("success", "Comment deleted!");
      res.redirect("/music/" + req.params.id);
    }
  });
});

module.exports = router; 