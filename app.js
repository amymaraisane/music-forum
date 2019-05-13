var express =     require('express'),
    app =         express(),
    request =     require('request'),
    path =        require('path'),
    bodyParser =  require('body-parser'),
    indexRouter = require('./routes/index'),
    mongoose =    require('mongoose');

    mongoose.connect("mongodb://localhost/albums", {useNewUrlParser: true});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));;
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//schema setup
var albumSchema = new mongoose.Schema({
  name: String,
  artist: String,
  image: String,
  description: String
  //option to add validation later to ensure its an html string
});

//connect schema to the available mongoose model properties by saving it as an object. use singular capitalized version of name here to avoid confusion
//mongoose is smart enough to store collection name as plural and lowercase even though convention says to capitalize it here
var Album = mongoose.model("Album", albumSchema);


// //.create combines the new Object and .save methods into one step
// Album.create(
//   {name: "Invasion Of Privacy", artist: "Cardi B", image: "data:image/jpeg;base64,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", description: "Released in 2018"},
//   {name: "Born to Run", artist: "Bruce Springsteen", image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Born_to_Run_%28Front_Cover%29.jpg/220px-Born_to_Run_%28Front_Cover%29.jpg", description: "This album contains arguably Bruce's most famous song, the title track Born to Run"},
//   (err, theProof)=>{
//   if(err){
//     console.log("woops");
//     console.log(err);
//   } else {
//     console.log(theProof);
//     //if more than one added, will only console.log the first one. not sure why currently
//   }
// });

//this is how to use the .find syntax on the model instance when its written into the program, rather than called in termainal
//use the capitalized Object name here not the lowercase plural collection name
// Album.find({}, (err, albumsbutcannameitanything)=>{
//   if(err){
//     console.log("woops");
//     console.log(err);
//   } else{
//     console.log("all albums");
//     console.log(albumsbutcannameitanything);
//   }
// });

var albums = [
  {name: "Lemonade", artist: "Beyonce", image: "data:image/jpeg;base64,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"},
  {name: "Mansion", artist: "NF", image: "data:image/jpeg;base64,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"},
  {name: "Coloring Book", artist: "Chance the Rapper", image: "https://upload.wikimedia.org/wikipedia/en/c/c4/Chance_the_Rapper_-_Coloring_Book.png" },
  {name: "The Times They Are a-Changin'", artist: "Bob Dylan", image: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Bob_Dylan_-_The_Times_They_Are_a-Changin%27.jpg/220px-Bob_Dylan_-_The_Times_They_Are_a-Changin%27.jpg"}
];

//root route
app.use('/', indexRouter);

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
  //grab input from form req
  let name = (req.body.newAlbum);
  let artist = (req.body.artist);
  let image = (req.body.imageURL);
  let description = (req.body.description);
  //create new object with form data
  //it's working now- if it ever stops, can do {name: name, image: image}
  let newAlbum = {name, artist, image, description};
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
  //ok to use right away below because at this point it is still a string?
  Album.findById(albumID, (err, foundAlbum)=>{
    if(err){
      console.log(err);
    } else{
      //changed the key name to album since it can be anything and that makes most sense
      res.render('show', {album: foundAlbum});
    }
  });
});
  //If action is absent, default in HTML5 is to send data back to the same page you are already on. 
  //If the get or post request is associated with a different route, include an action to direct data to the correct route. 


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
