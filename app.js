var express =       require('express'),
    app =           express(),
    request =       require('request'),
    path =          require('path'),
    bodyParser =    require('body-parser'),
    methodOverride= require('method-override')
    indexRouter =   require('./routes/index'),
    mongoose =      require('mongoose');
    expressSanitizer=require('express-sanitizer')

// 'mongodb+srv://user1:kiwi53@cluster0-enwgt.mongodb.net/test?retryWrites=true'
//user refers to the user for the cluster under Security tab
mongoose.connect("mongodb://localhost/albums", {useNewUrlParser: true});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({ extended: true }));;
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//schema setup
var albumSchema = new mongoose.Schema({
  name: String,
  artist: String,
  image: String,
  about: String,
  //need to add validation later to ensure its an html string to avoid mongoose cast to object ID error
  //i would like the image to also be an anchor tag to go to the show page. need to figure out how to put image if user doesnt inclde one
  created: {type: Date, default: Date.now}
  //will not appear as a form input, rather will be automatically created when submit button is clicked

});

//connect schema to the available mongoose model properties by saving it as an object. use singular capitalized version of name here to avoid confusion
//mongoose is smart enough to store collection name as plural and lowercase even though convention says to capitalize it here
var Album = mongoose.model("Album", albumSchema);

var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  albums: [albumSchema]
  //schema must be defined earlier in the code so can reference it when nested
})

var User = mongoose.model("User", userSchema);

var newUser = new User({
  name: "Charlie",
  email: "adfasdfaf",
})

newUser.save((err, user)=>{
  if(err){
    console.log(err);
  } else{
    console.log(user);
  } 
});

//option to use .create mongoose method which combines the new Object and .save methods into one step
// var albums = [
//   {name: "Lemonade", artist: "Beyonce", image: "data:image/jpeg;base64,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"},
//   {name: "Mansion", artist: "NF", image: "data:image/jpeg;base64,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"},
//   {name: "Coloring Book", artist: "Chance the Rapper", image: "https://upload.wikimedia.org/wikipedia/en/c/c4/Chance_the_Rapper_-_Coloring_Book.png" },
//   {name: "The Times They Are a-Changin'", artist: "Bob Dylan", image: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Bob_Dylan_-_The_Times_They_Are_a-Changin%27.jpg/220px-Bob_Dylan_-_The_Times_They_Are_a-Changin%27.jpg"}
// ];

//root route
app.use('/', indexRouter);
  //okay for this to also redirect to '/music' if you prefer

//INDEX route- show all albums
app.get('/music', (req, res)=>{
  Album.find({}, (err, allAlbums)=>{
    if(err){
      console.log(err);
    } else{
      res.render('index', {albums: allAlbums});
    }
  });
});

/* GET music listing from itunes API. */
app.get('/music/search', function(req, res) {
  //grabs query string from req the form get method made
  var singer = req.query.singer;
  var url = 'https://itunes.apple.com/search?term=' + singer + '&entity=song';
  request(url, (error, response, body)=>{
    if (!error && response.statusCode == 200){
      var results = JSON.parse(body).results;
      res.render('search', {results: results});
    }
  });
});

//NEW route - show form to create new album
app.get('/music/new', (req, res)=>{
  res.render('newPost');
})

//CREATE route - add new album to db
app.post('/music', (req, res)=>{
  //grab input from form req object in name
  let newAlbum = req.body.album;
  newAlbum.about = req.sanitize(newAlbum.about);
  //create a new album and save to db
  Album.create(newAlbum, (err, newlyCreated)=>{
    if (err){
      console.log(err);
    } else{
      res.redirect('/music');
    }
  });
});


//SHOW route- shows one album with all its info
//because it will be /music/:id, very important that it comes after the predefined routes of same syntax
app.get('/music/:id', (req, res)=>{
  //id comes from the url request
  var albumID = req.params.id;
  //ok to use without parsing because at this point it is still a string?
  Album.findById(albumID, (err, foundAlbum)=>{
    if(err){
      console.log(err);
    } else{
      res.render('show', {album: foundAlbum});
    }
  });
});

//EDIT route
app.get('/music/:id/edit', (req, res)=>{
  var albumID = req.params.id;
  // //ok to use right away below because at this point it is still a string?
  Album.findById(albumID, (err, album)=>{
    if(err){
      console.log(err);
    } else{
    res.render('edit', ({album: album}));
    }
  });  
});

//UPDATE route
app.put('/music/:id', (req, res)=>{
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
app.delete('/music/:id', (req, res)=>{
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

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;

// app.listen(3000, () =>{
// 	console.log('server listening on port 3000');
// });