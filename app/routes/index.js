var express =   require('express');
    router =    express.Router();
    request =   require('request');
    passport =  require('passport');
    User =      require("../models/user");

//root route
router.get('/', function(req, res, next) {
  res.render('home.ejs');
});

//show register form
router.get('/register', (req, res)=>{
  res.render('register');
});

//handle register logic
router.post('/register', (req, res)=>{
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user)=>{
      if (err || !user){
        req.flash("error", err.message);
        return res.redirect('/register');
      }
      req.flash("success", "Welcome, " + user.username + " !");
      passport.authenticate('local')(req, res, ()=>{
        res.redirect('/music');
      });
  });  
});

//show login form
router.get('/login', (req, res)=>{
  res.render("login");
});

//handle login logic
router.post('/login', passport.authenticate('local',{
  successRedirect: "/music",
  failureRedirect: "/login",
  failureFlash: true,
}),(req, res)=>{
});

//logout route
router.get('/logout', (req, res)=>{
  req.logout();
  req.flash("success", "You are logged out");
  res.redirect('/music');
});

module.exports = router;