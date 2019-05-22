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
      res.render('albums/index', {albums: allAlbums});
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
  res.render('albums/new');
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
  //this is called a path parameter
  var albumID = req.params.id;
  console.log(albumID);
  //ok to use without parsing because at this point it is still a string?
  Album.findById(albumID).populate("comments").exec((err, foundAlbum)=>{
    if(err){
      console.log(err);
    } else{
      res.render('albums/show', {album: foundAlbum});
    }
  });
});

// ------------------------------------------------
// COMMENTS ROUTES
// ------------------------------------------------

//NEW route
app.get('/music/:id/comments/new', (req, res)=>{
  Album.findById(req.params.id, (err, album)=>{
    //this is the step I didn't know we needed. the new template should have access to which album the comment is for
    if (err){
      console.log(err);
    } else {
      console.log(album);
      res.render('comments/new', {album: album});
    }
  })
  //from button on show page, show ejs template for new campground
  
})

//CREATE route
app.post('/music/:id/comments', (req, res)=>{
  //grab input from form req object in name
  let newComment= req.body.comment;
  Album.findById(req.params.id, (err, album)=>{
  //find the album FIRST, req.params refers to the route parameters! :)
    if (err){
      console.log(err);
    } else{
      newComment.text = req.sanitize(newComment.text);
        //create a new comment and save to db
        //why dont we have to use .populate to show all comments?
      Comment.create(newComment, (err, comment)=>{
        //create comment, push it onto album comments array in db, save 
        if (err){
          console.log("comment not created", err);
        } else { 
          album.comments.push(comment);
          //push the successfully created comment, not the original form data
          //now saving the entire album with its new data wich will include the new comment
          album.save((err, data)=>{
            if (err){
              console.log(err);
            } else {
              console.log(data);
            }
          });
        }
      });
      res.redirect('/music/' + album._id);
      //added ._id since the .findById method returns the entire album object
      //why is colt's redirect still nested?
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
    res.render('albums/edit', ({album: album}));
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