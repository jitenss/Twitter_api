// Require our dependencies
var Tweet = require('../models/tweet');
var server = require('../../app');
var io = require('socket.io').listen(server);

//Stop Streaming function
function stopStreaming(){
	console.log('Streaming stopped');
}

// Function to support stream
module.exports = function(stream,res){
	res.send("Streaming started");
	
	//Streaming tweets
	stream.on('data', function(tweet){
		console.log(tweet);

		//Converting hashtags, urls and usermentions into array
		var texts = [];
		var url = [];
		var userMentions = [];
		if(tweet.entities.hashtags.length>0){
			for (var hash in tweet.entities.hashtags){	    
					texts.push(tweet.entities.hashtags[hash].text);
			}
		}
		if(tweet.entities.urls.length>0){
			for (var u in tweet.entities.urls){	    
					url.push(tweet.entities.urls[u].url);
			}
		}
		if(tweet.entities.user_mentions.length>0){
			for (var u in tweet.entities.user_mentions){	    
					url.push(tweet.entities.user_mentions[u].name);
			}
		}

	    //Convert to epoch format
	    var date = Date.parse(tweet.created_at);
		var epoch = new Date(date).getTime()/1000.0;

		//Data to be stored in database
	    var data = {
	    	id: tweet.id,
	    	created_at: tweet.created_at,
	    	text: tweet.text,
	    	source: tweet.source,
	    	truncated: tweet.truncated,
	    	in_reply_to_status_id: tweet.in_reply_to_status_id,
    		in_reply_to_user_id: tweet.in_reply_to_user_id,
    		in_reply_to_screen_name: tweet.in_reply_to_screen_name,
	    	user:{
	    		id: tweet.user.id,
				name: tweet.user.name,
				screen_name: tweet.user.screen_name,
				location: tweet.user.location,
				followers_count: tweet.user.followers_count,
				friends_count: tweet.user.friends_count,
				listed_count: tweet.user.listed_count,
				favourites_count: tweet.user.favourites_count,
				statuses_count: tweet.user.statuses_count
	    	},
	    	quote_count: tweet.quote_count,
			reply_count: tweet.reply_count,
	    	retweet_count: tweet.retweet_count,
	    	favourite_count: tweet.favorite_count,
	    	entities:{
	    		hashtags: texts,
	    		urls: url,
	    		user_mentions: userMentions
	    	},	
	    	date: epoch
	    }
	    
	    //Store the data in database
	    Tweet.storeTweet(data,function(err){
	    	if(err) throw err;
	    	io.emit('stream',data);	
	    });
		
	});

	//Handling errors
	stream.on('error', function(error){
	   	console.log(error);
	});

	// Disconnect stream after ten seconds
	setTimeout(stream.destroy, 10000);
	setTimeout(stopStreaming, 11000);
}