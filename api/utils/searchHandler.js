// Require our dependencies
var Tweet = require('../models/tweet');
var replace = require('replace');
var Json2csvParser = require('json2csv').Parser;
var fs = require("fs");

//Variables required to Generate CSV Files
var fields = ['created_at','text', 'user.name','user.location','quote_count','reply_count','retweet_count','favourite_count'];
var json2csvParser = new Json2csvParser({ fields });

//Function to make Regular Expression
function makeRegex(text,searchType){
	var regex;
	switch(searchType){
		case 'starts_with':
			regex = new RegExp("^"+text,'gi');
			break;
		case 'ends_with':
			regex = new RegExp(text+"$",'gi');
			break;
		case 'contains':
			regex = new RegExp(text,'gi');
			break;
		default:
			regex = 0;
	}
	return regex;
}


//Function to convert date into epoch format
function getEpochDate(date){

	var myDate = new Date(date);
	var epoch = myDate.getTime()/1000.0;

	return epoch;
}


//Function to retrieve tweets by text
module.exports.searchText = function(data,res){
	var regex = makeRegex(data.searchKey,data.stringSearchType);

	//If string search type is wrong
	if(regex===0)
		res.send("Wrong stringSearchType");

	//Finding tweets from the database and sending the resonse
	else{
		Tweet.getTweetsByText(regex,data,function(err,result){
			if(err) throw err;
			res.send(result);
			
			//Generate csv file
			if(data.csvFile=='yes' && result.length>0){
				var fd = fs.openSync('searchText.txt', 'w');
				var csv = json2csvParser.parse(result);
				fs.writeFile('searchText.txt', csv, function (err) {
		  			if (err) throw err;
		  			console.log('Generated CSV File');
				});
				fs.closeSync(fs.openSync('searchText.txt', 'w'));
			}
			else if(result.length<=0)
				console.log("CSV File not generated as result is empty");
		});
	}
}


//Function to retrieve tweets by username
module.exports.searchUserName = function(data,res){
	var regex = makeRegex(data.searchKey,data.stringSearchType);

	//If string search type is wrong
	if(regex===0)
		res.send("Wrong stringSearchType");

	//Finding tweets from the database and sending the resonse
	else
	{
		Tweet.getTweetsByUserName(regex,data,function(err,result){
			if(err) throw err;
			res.send(result);

			//Generate csv file
			if(data.csvFile=='yes' && result.length>0){
				var fd = fs.openSync('searchUserName.txt', 'w');
				var csv = json2csvParser.parse(result);
				fs.writeFile('searchUserName.txt', csv, function (err) {
		  			if (err) throw err;
		  			console.log('Generated CSV File');
				});
				fs.closeSync(fs.openSync('searchUserName.txt', 'w'));
			}
			else if(result.length<=0)
				console.log("CSV File not generated as result is empty");	
		});
	}
}


//Function to retrieve tweets by retweet count
module.exports.searchRetweetCount = function(data,res){

	if(isNaN(data.searchKey)===true)
		res.send("Key not a Number");
	else{
		var retweetCount = parseInt(data.searchKey);

		//Finding tweets from the database and sending the resonse
		Tweet.getTweetsByRetweets(retweetCount,data,res,function(err,result){
			if(err) throw err;
			res.send(result);

			//Generate csv file
			if(data.csvFile=='yes' && result.length>0){
				var fd = fs.openSync('searchRetweetCount.txt', 'w');
				var csv = json2csvParser.parse(result);
				fs.writeFile('mynewfile3.txt', csv, function (err) {
					if (err) throw err;
				 			console.log('Generated CSV File');
				});
				fs.closeSync(fs.openSync('searchRetweetCount.txt', 'w'));
			}
			else if(result.length<=0)
				console.log("CSV File not generated as result is empty");
		});
	}
}


//Function to retrieve tweets by favourite count
module.exports.searchFavouriteCount = function(data,res){

	if(isNaN(data.searchKey)===true)
		res.send("Key not a Number");
	else{
		var favouriteCount = parseInt(data.searchKey);

		//Finding tweets from the database and sending the resonse
		Tweet.getTweetsByFavouriteCount(favouriteCount,data,res,function(err,result){
			if(err) throw err;
			res.send(result);

			//Generate csv file
			if(data.csvFile=='yes' && result.length>0){
				var fd = fs.openSync('searchFavouriteCount.txt', 'w');
				var csv = json2csvParser.parse(result);
				fs.writeFile('searchFavouriteCount.txt', csv, function (err) {
					if (err) throw err;
				 			console.log('Generated CSV File');
				});
				fs.closeSync(fs.openSync('searchFavouriteCount.txt', 'w'));
			}
			else if(result.length<=0)
				console.log("CSV File not generated as result is empty");
		});
	}
}


//Function to retrieve tweets by date
module.exports.searchDate = function(data,res){
	var fromDate = getEpochDate(data.fromDate);
	var toDate = getEpochDate(data.toDate);
	
	//Finding tweets from the database and sending the resonse
	Tweet.getTweetsByDate(fromDate,toDate,data,function(err,result){
		if(err) throw err;

		res.send(result);

		//Generate csv file
		if(data.csvFile=='yes' && result.length>0){
			var fd = fs.openSync('searchDate.txt', 'w');
			var csv = json2csvParser.parse(result);
			fs.writeFile('searchDate.txt', csv, function (err) {
				if (err) throw err;
			 			console.log('Generated CSV File');
			});
			fs.closeSync(fs.openSync('searchDate.txt', 'w'));
		}
		else if(result.length<=0)
			console.log("CSV File not generated as result is empty");
	})
}



