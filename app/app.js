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

//user refers to the user for the cluster under Security tab
const url = process.env.DATABASEURL || "MONGODB://localhost/albums"

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true
});

mongoose.set('useFindAndModify', false);

// moment().format("YYYY, hA");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));;
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//custom middleware to pass user data in to each route
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
//custom middleware to pass user data in to each route
//must go after passport is set up
//sort of like creating a global variable, but the associated value can be different for each route

app.use(indexRoutes);
app.use("/music", albumRoutes);
app.use("/music/:id/comments", commentRoutes);
 
// seedDB();

// User.create({
//   name: "Hai",
//   password: "bfasdf@asdf"
// }, (err, newUser)=>{
//   if(err){
//     console.log(err);
//   }
// });

//easiest to create the user first, then create the album associated with the user but either way it can save to user correctly

// Album.create({
//   name: "Ladies of the Canyon", artist: "Joni Mitchell", image: "https://upload.wikimedia.org/wikipedia/en/0/00/Joni_Ladies.jpg", about: "'Circle Game' off of this album is a classic!"
// }, (err, newAlbum)=>{
//   if(err){
//     console.log("new Album did not save correctly", err);
//   } else{
//     User.findOne({name: "Hai"}, (err, foundUser)=>{
//       foundUser.albums.push(newAlbum);
//       foundUser.save((err, data)=>{
//         if (err){
//           console.log(err);
//         } else {
//           console.log(data);
//         }
//       });
//     });
//   }
// });

// User.findOne({name: "Hai"}).populate("albums").exec((err, user)=>{
//   if (err){
//     console.log(err);
//   } else {
//     console.log(user.albums);
//   }
// });

module.exports = app;

const PORT = process.env.PORT || 3000;

app.listen(PORT, process.env.IP, () => {
    console.log(`Our app is running on port ${ PORT }`);
});