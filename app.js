var express =       require('express'),
    app =           express(),
    request =       require('request'),
    path =          require('path'),
    bodyParser =    require('body-parser'),
    methodOverride= require('method-override'),
    indexRouter =   require('./routes/index'),
    mongoose =      require('mongoose');
    expressSanitizer=require('express-sanitizer'),
    Album =         require("./models/album");
    User =          require("./models/user");
    Comment =       require("./models/comment");
//  ./ references current directory
    seedDB  =       require("./seeds");


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

//runs seedDB right away to delete albums and create more  
seedDB();

// User.create({
//   name: "Hai",
//   email: "bfasdf@asdf"
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
  Album.findById(albumID).populate("comments").exec((err, foundAlbum)=>{
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

app.listen(3000, () =>{
	console.log('server listening on port 3000');
});