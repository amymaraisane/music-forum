var express =   require('express');
    router =    express.Router();
    request =   require('request');
    Album =     require("../models/album");
    User =      require("../models/user");
    middlewareObj = require("../middleware");

/* GET music listing from itunes API. */
router.get('/search', function(req, res) {
    var singer = req.query.singer;
    var url = 'https://itunes.apple.com/search?term=' + singer + '&entity=album';
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
        req.flash("error", "This site is experiencing maintenance. Be back soon!");
      } else{
        res.render('albums/index', {albums: allAlbums});
      }
    });
});
  
  
//Album NEW route
router.get('/new', middlewareObj.isLoggedIn, (req, res)=>{
    res.render('albums/new');
});

//Album CREATE route
router.post('/', middlewareObj.isLoggedIn, (req, res)=>{
    let newAlbum = req.body.album;
    let author = {
      id: req.user._id,
      username: req.user.username
    }
    newAlbum.author = author;
    newAlbum.about = req.sanitize(newAlbum.about);
    Album.create(newAlbum, (err, album)=>{
        if (err){
        req.flash("error", "This site is experiencing maintenance. Be back soon!");
        } else{
        req.flash("success", "Album added!");
        res.redirect('/music');
        }
    });
});
  
  
//Album SHOW route
router.get('/:id', (req, res)=>{
  var albumID = req.params.id;
  Album.findById(albumID).populate("comments").exec((err, foundAlbum)=>{
    if(err || !foundAlbum){
      req.flash("error", "Sorry, that album does not exist!");
      return res.redirect('/music');
    }
    res.render('albums/show', {album: foundAlbum});
  });
});
  
//Album EDIT route
router.get('/:id/edit', middlewareObj.isLoggedIn, middlewareObj.checkAlbumOwnership, (req, res)=>{
  res.render('albums/edit', ({album: req.album})); 
});

//Album UPDATE route
router.put('/:id', middlewareObj.checkAlbumOwnership, (req, res)=>{
    var albumID = req.params.id;
    var newData = req.body.album;
    newData.about = req.sanitize(newData.about);
    Album.findByIdAndUpdate(albumID, newData, (err, album)=>{
      if(err || !album){
        req.flash("error", "Album not found");
        res.redirect('/');
      } else{
        req.flash("success", album.name + " updated!");
        res.redirect('/music/' + albumID);
      }
    });
});

//Album DELETE route
router.delete('/:id', middlewareObj.checkAlbumOwnership, (req, res)=>{
  var albumID = req.params.id;
  Album.findByIdAndRemove(albumID, err=>{
    if(err){
      req.flash("error", "You cannot delete this album");
    } else{
      req.flash("success", "Album deleted");
      res.redirect('/music');
    }
  });
});

module.exports = router;