var express =   require('express');
    router =    express.Router();
    request =   require('request'),
    passport =  require('passport');
    User =      require("../models/user");

/* GET landing page. */
router.get('/', function(req, res, next) {
  res.render('home.ejs');
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