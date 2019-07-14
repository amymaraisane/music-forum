var express =       require('express'),
    app =           express(),
    request =       require('request'),
    path =          require('path'),
    bodyParser =    require('body-parser'),
    methodOverride= require('method-override'),
    mongoose =      require('mongoose');
    flash =         require('connect-flash');
    expressSanitizer=require('express-sanitizer'),
    passport        = require('passport');
    LocalStrategy   = require('passport-local');
    passportLocalMongoose  = require('passport-local-mongoose');
    moment =        require('moment'),
    date =          moment(),

    Album =         require("./models/album");
    User =          require("./models/user");
    Comment =       require("./models/comment");

    albumRoutes =   require('./routes/albums'),
    commentRoutes = require('./routes/comments'),
    indexRoutes =   require('./routes/index');

const url = process.env.DATABASEURL || "mongodb://localhost/albums"

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true 
});

mongoose.set('useFindAndModify', false); 
 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); 


app.use(bodyParser.urlencoded({ extended: true }));;
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());

app.use(require('express-session')({
  secret: "Developmental Secret Session",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use("/music", albumRoutes);
app.use("/music/:id/comments", commentRoutes);


module.exports = app;

const PORT = process.env.PORT || 3000;

app.listen(PORT, process.env.IP, () => {
    console.log(`Our app is running on port ${ PORT }`);
});