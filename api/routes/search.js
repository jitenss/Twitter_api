// Require our dependencies
var express = require('express');
var router = express.Router();
var Tweet = require('../models/tweet');
var searchHandler = require('../utils/searchHandler');
var validationHandler = require('../utils/validationHandler');

// Route to filter the tweets according to the field
router.post('/:queryOn',function(req,res){

	var queryOn = req.params.queryOn;

	//Data input by the user
	var data = validationHandler.validateQueryData(req,res,queryOn)

	//Calling functions to filter data on different fields
	if(data!=0)
	{
		switch(queryOn){
			case 'text':
				searchHandler.searchText(data,res);
				break;
			case 'username':
				searchHandler.searchUserName(data,res);
				break;
			case 'retweetCount':
				searchHandler.searchRetweetCount(data,res);
				break;
			case 'dateRange':
				searchHandler.searchDate(data,res);
				break;
			case 'favouriteCount':
				searchHandler.searchFavouriteCount(data,res);
				break;
			default:
				res.send("Wrong entry for query");
		}
	}
});

module.exports = router;