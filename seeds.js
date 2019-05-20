var mongoose = require('Mongoose');

mongoose.connect("mongodb://localhost/albums", {useNewUrlParser: true});

function seedDB(){
    //remove all albums
    Album.deleteMany({}, (err)=>{
        if (err){
            console.log(err);
        } else {
            console.log("removed all albums");
        }
    });
    //add a few albums
    Album.create({
        name: "Ladies of the Canyon", artist: "Joni Mitchell", image: "https://upload.wikimedia.org/wikipedia/en/0/00/Joni_Ladies.jpg", about: "'Circle Game' off of this album is a classic!"
    }, (err, newAlbum)=>{
        if(err){
            console.log("new Album did not save correctly", err);
        } else{
            console.log(album);
        }
    });
    //add comments
}

    module.exports = seedDB;