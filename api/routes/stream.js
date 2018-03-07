// Require our dependencies
var express = require('express');
var twitter = require('twitter');
var streamHandler = require('../utils/streamHandler');
var router = express.Router();
var config = require('../../config');

//Connect to twitter
var client = new twitter(config);

//Route to stream tweets according to the key given
router.post('/',function(req,res){

	var keywordToSearch = req.body.text;
	console.log(keywordToSearch);

	//Stream Tweets
	client.stream('statuses/filter', {track: keywordToSearch}, function(stream) {
		streamHandler(stream,res);
	});
});

module.exports = router;