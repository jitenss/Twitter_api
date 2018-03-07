// Require our dependencies
var mongoose = require('mongoose');

// Create a new schema for our tweet data
var tweetSchema = mongoose.Schema({
	id: Number,
	created_at: String,
	text: String,
	source: String,
	truncated: Boolean,
	in_reply_to_status_id: Number,
    in_reply_to_user_id: Number,
    in_reply_to_screen_name: String,
	user: {
		id: Number,
		name: String,
		screen_name: String,
		location: String,
		followers_count: Number,
		friends_count: Number,
		listed_count: Number,
		favourites_count: Number,
		statuses_count: Number,
	},
	quote_count: Number,
	reply_count: Number,
	retweet_count: Number,
	favourite_count: Number,
	entities: {
		hashtags: [String],
		urls: [String],
		user_mentions: [String]
	},	
	date: Number
});

// Return a Tweet model based upon the defined schema
var Tweet = module.exports = mongoose.model('Tweet',tweetSchema);

//Function for the number of skips in documents
function skips(pageSize,pageNum){
	return ((pageSize * pageNum) - pageSize);
}

//Function to store tweets in the database
module.exports.storeTweet = function(tweet,callback){
	var tweetEntry = new Tweet(tweet);
	tweetEntry.save(callback)
}

//Function to find tweets by text from the database
module.exports.getTweetsByText = function(regex,data,callback){
	var sortOn = data.sortOn;
	var orderSort = data.orderSort;
	var skipDocs = skips(data.pageSize,data.pageNum);
	var pageSize = data.pageSize;

	//Query
	var searchQuery = {
		"text": regex
	};
	var temp = Tweet.find(searchQuery);

	//If sorting is required
	if(sortOn!=undefined){
		var sortQuery = {
			sortOn: orderSort
		}
		temp = temp.sort(sortQuery);
	}
	//Pagination
	temp.skip(skipDocs).limit(pageSize).exec(callback);
}

//Function to find tweets by username from the database
module.exports.getTweetsByUserName = function(regex,data,callback){
	var sortOn = data.sortOn;
	var orderSort = data.orderSort;
	var skipDocs = skips(data.pageSize,data.pageNum);
	var pageSize = data.pageSize;

	//Query
	var searchQuery = {
		"user.name": regex
	};
	var temp = Tweet.find(searchQuery);

	//If sorting is required
	if(sortOn!=undefined){
		var sortQuery = {
			sortOn: orderSort
		}
		temp = temp.sort(sortQuery);
	}
	//Pagination
	temp.skip(skipDocs).limit(pageSize).exec(callback);
}

//Function to find tweets by number of retweets from the database
module.exports.getTweetsByRetweets = function(retweetCount,data,res,callback){
	var intComp = data.intSearchType;
	var sortOn = data.sortOn;
	var orderSort = data.orderSort;
	var skipDocs = skips(data.pageSize,data.pageNum);
	var pageSize = data.pageSize;
	
	var temp;
	
	//Comparing how to find data (greater than, less than, etc to an integer) and applying query  
	switch(intComp){
		case 'less_than':
			temp = Tweet.find({"retweet_count": {$lt: retweetCount}});
			break;
		case 'greater_than':
			temp = Tweet.find({"retweet_count": {$gt: retweetCount}});
			break;
		case 'less_than_equal':
			temp = Tweet.find({"retweet_count": {$lte: retweetCount}});
			break;
		case 'greater_than_equal':
			temp = Tweet.find({"retweet_count": {$gte: retweetCount}});
			break;
		case 'equal':
			temp = Tweet.find({"retweet_count": {$eq: retweetCount}});
			break;
		default:
			temp = 0;
			res.send("Wrong intSearchType");
	}
	if(temp!=0){
		//If sorting is required
		if(sortOn != undefined){
			var sortQuery = {
				sortOn: orderSort
			};
			//console.log(sortOn);
			temp = temp.sort(sortQuery);
		}
		//pagination
		temp.skip(skipDocs).limit(pageSize).exec(callback);
	}
}

//Function to find tweets by number of favourite count from the database
module.exports.getTweetsByFavouriteCount = function(retweetCount,data,res,callback){
	var sortOn = data.sortOn;
	var orderSort = data.orderSort;
	var intComp = data.intSearchType;
	var skipDocs = skips(data.pageSize,data.pageNum);
	var pageSize = data.pageSize;
	var temp;

	//Comparing how to find data (greater than, less than, etc to an integer) and applying query
	switch(intComp){
		case 'less_than':
			temp = Tweet.find({"favourite_count": {$lt: retweetCount}});
			break;
		case 'greater_than':
			temp = Tweet.find({"favourite_count": {$gt: retweetCount}});
			break;
		case 'less_than_equal':
			temp = Tweet.find({"favourite_count": {$lte: retweetCount}});
			break;
		case 'greater_than_equal':
			temp = Tweet.find({"favourite_count": {$gte: retweetCount}});
			break;
		case 'equal':
			temp = Tweet.find({"favourite_count": {$eq: retweetCount}});
			break;
		default:
			temp = 0;
			res.send("Wrong intSearchType");
	}

	if(temp!=0){
		//If sorting is required
		if(sortOn != undefined){
			var sortQuery = {
				sortOn: orderSort
			};
			temp = temp.sort(sortQuery);
		}
		//Pagination
		temp.skip(skipDocs).limit(pageSize).exec(callback);
	}
}

//Function to find tweets in the given date range from the database
module.exports.getTweetsByDate = function(fromDate,toDate,data,callback){
	var sortOn = data.sortOn;
	var orderSort = data.orderSort;
	var skipDocs = skips(data.pageSize,data.pageNum);
	var pageSize = data.pageSize;

	//Query
	var temp = Tweet.find({$and: [{"date": {$gte: fromDate}},{"date": {$lte: toDate}}]});

	//If sorting is required
	if(sortOn != undefined){
		var sortQuery = {
			sortOn: orderSort
		};
		temp = temp.sort(sortQuery)
	}
	//Pagination
	temp.skip(skipDocs).limit(pageSize).exec(callback);
}

