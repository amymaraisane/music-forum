var express =   require('express');
    router =    express.Router();
    passport =  require('passport');
    User =      require("../models/user");

//EDIT route
router.get('/music/:id/edit', (req, res)=>{
  var albumID = req.params.id;
  // //ok to use right away below because at this point it is still a string?
  Album.findById(albumID, (err, album)=>{
    if(err){
      console.log(err);
    } else{
    res.render('albums/edit', ({album: album}));
    }
  });  
});

//UPDATE route
router.put('/music/:id', (req, res)=>{
  var albumID = req.params.id;
  var newData = req.body.album;
  newData.about = req.sanitize(newData.about);
  Album.findByIdAndUpdate(albumID, newData, (err, album)=>{
    if(err){
      console.log(err);
    } else{
      res.redirect('/music/' + albumID);
      //typically after creating or updating, redirect to new url dont just show file
    }
  });
});

//DELETE route
router.delete('/music/:id', (req, res)=>{
  //the link to this route has to come from the action of a FORM since its a post request. a tag wont work. 
  var albumID = req.params.id;
  Album.findByIdAndRemove(albumID, err=>{
  //this time there is NO data to pass into the callback 
    if(err){
      console.log(err);
    } else{
      res.redirect('/music');
      //typically after creating or updating, redirect to new url dont just show file
    }
  });
});

//---------------------
//Login/Register Routes
//-----------------------
router.get('/register', (req, res)=>{
  res.render('register');
});

router.post('/register', (req, res)=>{
  var newUser = new User({username: req.body.username});
  //User.register will create a hash for the password and save that in the db along with a salt to unencrypt it
  User.register(newUser, req.body.password, (err, user)=>{
      if (err){
        console.log(err);
        return res.render('register');
      }
      //passport.authenticate runs the serializeUser() method and logs the user in
      //sign up, get credentials, register the app for fb/twitter
      passport.authenticate('local')(req, res, ()=>{
        res.redirect('/music');
      });
  });  
});

router.get('/login', (req, res)=>{
  res.render('login');
});

router.post('/login', passport.authenticate('local',{
  successRedirect: "/music",
  failureRedirect: "/login"
}),(req, res)=>{
  //check if user is in dbr by passing passport.authenticalte('local) as part of the post req
  //woohoo!! its a middleware= anything that runs before the final route callback/handler
});

router.get('/logout', (req, res)=>{
  req.logout();
  //passport destroys the user's data in the session
  res.redirect('/music');
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login'); 
}

module.exports = router;