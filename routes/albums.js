var express =   require('express');
    router =    express.Router();
    Album =     require("../models/album");

/* GET landing page. */
router.get('/', function(req, res, next) {
    res.render('home.ejs');
});

/* GET music listing from itunes API. */
router.get('/music/search', function(req, res) {
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
router.get('/music', (req, res)=>{
    Album.find({}, (err, allAlbums)=>{
      if(err){
        console.log(err);
      } else{
        res.render('albums/index', {albums: allAlbums});
      }
    });
});
  
  
//NEW route - show form to create new album
router.get('/music/new', isLoggedIn, (req, res)=>{
    res.render('albums/new');
})
  
//CREATE route - add new album to db
router.post('/music', isLoggedIn, (req, res)=>{
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
router.get('/music/:id', (req, res)=>{
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login'); 
}

module.exports = router;