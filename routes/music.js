var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const rp = require('request-promise');

/* GET music listing. */
router.get('/', function(req, res, next) {
  //dont need to type /music because we only get here when music route is used
  res.render('music.ejs');
});

router.post("/postSinger", (req, res)=>{
	let singerInput = req.body;
	console.log(singerInput);
	//in order for this post function to access the variable array, array must be stored globally not in another function
	res.send("thanks!");
	//res.redirect is the key to take the user away from the (necessary) post route back to the page they were originally on
	//as a reminder, the form has an action attribute which defines where the data will get sent. If action is absent, default in HTML5 is to send data back to the same page you are already on. In our case, the url of the blog page is different than the post route (incl req object) we have set up in our routes list so that is why we have to include action to direct data to the correct route. The method of the form has to be POST, which allows the form to send data when combined with logic in main app file
});

module.exports = router;
