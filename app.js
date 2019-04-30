var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var musicRouter = require('./routes/music');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post("/postSinger", (req, res)=>{
	let singerInput = req.body.singer;
	//in order for this post function to access the variable array, array must be stored globally not in another function
	res.send(singerInput);
	//res.redirect is the key to take the user away from the (necessary) post route back to the page they were originally on
	//as a reminder, the form has an action attribute which defines where the data will get sent. If action is absent, default in HTML5 is to send data back to the same page you are already on. In our case, the url of the blog page is different than the post route (incl req object) we have set up in our routes list so that is why we have to include action to direct data to the correct route. The method of the form has to be POST, which allows the form to send data when combined with logic in main app file
});

app.use('/', indexRouter);
app.use('/music', musicRouter);

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
