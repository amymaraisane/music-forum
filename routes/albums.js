var express =   require('express');
    router =    express.Router();
    Album =     require("../models/album");
    User =      require("../models/user");

/* GET music listing from itunes API. */
router.get('/search', function(req, res) {
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

//INDEX route- show all albums
router.get('/', (req, res)=>{
    Album.find({}, (err, allAlbums)=>{
      if(err){
        console.log(err);
      } else{
        res.render('albums/index', {albums: allAlbums});
      }
    });
});
  
  
//Album NEW route
router.get('/new', isLoggedIn, (req, res)=>{
    res.render('albums/new');
});

//Album CREATE route
router.post('/', isLoggedIn, (req, res)=>{
    //grab input from form req object in name
    let newAlbum = req.body.album;
    let author = {
      id: req.user._id,
      username: req.user.username
    }
    newAlbum.author = author;
    newAlbum.about = req.sanitize(newAlbum.about);
    //create a new album and save to db
    Album.create(newAlbum, (err, album)=>{
        if (err){
        console.log(err);
        } else{
        res.redirect('/music');
        }
    });
});
  
  
//Album SHOW route
//because it will be /music/:id, very important that it comes after the predefined routes of same syntax
router.get('/:id', (req, res)=>{
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

//Album EDIT route
router.get('/:id/edit', (req, res)=>{
  //ensure user is logged in
  if(req.isAuthenticated()){ 
    var albumID = req.params.id;
    Album.findById(albumID, (err, album)=>{
      if(err){
        res.redirect('/');
      } else{
        //ensure user created the album
        //once found, album is a mongoose object despite looking like a string when printed
        //req.user._id is a string. need to use.equals method to check equality
        if(album.author.id.equals(req.user._id)){
          res.render('albums/edit', ({album: album}));
        } else{
          res.send("cannot edit albums you did not create");
        }
      }
    });  
  } else{
    res.send("Please log in");
  }
});
  
//Album UPDATE route
router.put('/:id', (req, res)=>{
    var albumID = req.params.id;
    var newData = req.body.album;
    newData.about = req.sanitize(newData.about);
    Album.findByIdAndUpdate(albumID, newData, (err, album)=>{
      if(err){
        res.redirect('/');
      } else{
        res.redirect('/music/' + albumID);
        //typically after creating or updating, redirect to new url dont just show file
      }
    });
});

//Album DELETE route
router.delete('/:id', (req, res)=>{
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login'); 
}

function checkAlbumOwnership(req, res, next) {
  if(req.isAuthenticated()){ 
    var albumID = req.params.id;
    Album.findById(albumID, (err, album)=>{
      if(err){
        res.redirect("back");
      } else{
        //ensure user created the album
        //once found, album is a mongoose object despite looking like a string when printed
        //req.user._id is a string. need to use.equals method to check equality
        if(album.author.id.equals(req.user._id)){
          next();
        } else{
          res.redirect("back");
        }
      }
    });  
  } else{
    res.redirect("back");
  }
}

module.exports = router;