var express = require('express');
var app = express();
var request = require('request');
var path = require('path');

var indexRouter = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

/* GET music listing. */
app.get('/musicSearch', function(req, res) {
  //grabs query string from req the form get method made
  var singer = req.query.singer;
  var url = 'https://itunes.apple.com/search?term=' + singer + '&entity=song';
  request(url, (error, response, body)=>{
    if (!error && response.statusCode == 200){
      var results = JSON.parse(body).results;
      res.render('music', {results: results});
    }
  });
});

app.get('/musicDB', (req, res)=>{
  var albums = [
    {name: "Invasion Of Privacy", 
    artist: "Cardi B"},
    {name: "Thunder Road"}
  ];
  res.render('DB');
})
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
