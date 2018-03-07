//Function to Validate Input from the user
module.exports.validateQueryData = function(req,res,queryOn){

	var data = {
		searchKey: req.body.searchKey,	//data on which the tweet will be filtered
		fromDate: req.body.fromDate,	//date from which tweets will be filtered
		toDate: req.body.toDate,		//date till which tweets will be filtered
		stringSearchType: req.body.stringSearchType,	//check string search is startswith,endswith,etc	
		intSearchType: req.body.intSearchType,		//check int search is greater than,lessthan,etc
		sortOn: req.body.sortOn,					//sort on which parameter
		orderSort: parseInt(req.body.orderSort),	//order of sort ascending or descending
		pageSize: parseInt(req.body.pageSize),	//page size for pagination
		pageNum: parseInt(req.body.pageNum),	//page number for pagination
		csvFile: req.body.csv		//want csv files or not
	}

	//ISO Regular Expression
	var isoRegex = "[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T(2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9].000Z";

	//Key not required for dates but for others necessary
	if(queryOn!='dateRange')
		req.checkBody('searchKey','Key is required').notEmpty();
	
	//Validations for pagesize, pagenumber and order of sorting
	req.checkBody('pageSize','Page size is required and should be a valid integer').isInt({gt: 0}).notEmpty();
	req.checkBody('pageNum','Page Number is required and should be a valid integer').isInt({gt: 0}).notEmpty();
	req.checkBody('orderSort','Should be an integer: 1 for aesc and -1 for desc').isInt({gt: -2, lt: 2});

	//Validations for particular fields only
	switch(queryOn){
		case 'dateRange':
			req.checkBody('fromDate','Date should be given in correct format').matches(isoRegex).notEmpty();
			req.checkBody('toDate','Date should be given in correct format').matches(isoRegex).notEmpty();
			break;
		case 'retweetCount':
		case 'favouriteCount':
			req.checkBody('intSearchType','intSearchType should not be empty').notEmpty();
			break;
		case 'text':
		case 'username':
			req.checkBody('stringSearchType',' stringSearchType should not be empty').notEmpty();
			break;	
	}

	var errors = req.validationErrors();

	if(errors){
		res.send(errors);
		return 0;
	}
	else{
		return data;
	}
}
