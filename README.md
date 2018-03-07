# Twitter_api
A RESTful API that streams tweets depending on the keyword entered by the user and stores the tweets in the NoSQL(MongoDB) database. It returns stored tweets and their metadata based on applied filters. It exports filtered data as CSV depending on the users choice.

## Directory Structure
* api/          
  * models/         
    * tweet.js          // Our Mongoose Tweet Model
  * routes        
    * search.js         // Search Routes
    * stream.js         // Stream Routes
  * utils    
    * searchHandler.js        // Utility method for handling tweet filters
    * streamHandler.js        // Utility method for handling Twitter streams
    * validationHandler.js          // Utility method for validating inputs from users
* app.js        // Server side main
* config.js       // Configuration
* package.json
    
## Endpoints
### Streaming
URL | Method | URL Params | Data Params
----- | ----- | ------- | ---------
/stream | POST | None | text

Data Params | Details
---- | -----
text | Keyword for streaming tweets

### Searching
URL | Method | URL Params | Data Params
----- | ----- | ------- | ---------
/search/:queryOn | POST | queryOn | searchKey, fromDate, toDate, stringSearchType, intSearchType, sortOn, orderSort, pageSize, pageNum, csvFile

URL Params | Details
--- | ---
queryOn | Fields to search tweets (text, username, retweetCount, dateRange, favouriteCount)

Data Params | Details
--- | ---
searchKey | Required parameter. Tweet to be searched on this key, depending on the queryOn parameter
fromDate | Required parameter if queryOn parameter is dateRange. To be specifeid in ISO format, i.e. YYYY-MM-DDTHH:mm:ss.000Z
toDate | Required filed if queryOn parameter is dateRange. To be specifeid in ISO format, i.e. YYYY-MM-DDTHH:mm:ss.000Z
stringSearchType | Required parameter if queryOn parameter is text, username (starts_with, ends_with, contains)
intSearchType | Required field if queryOn parameter is retweetCount, favouriteCount (less_than, greater_than, less_than_equal, greater_than_equal, equal)
pageSize | Required parameter for the page to be accessed
pageNum | Required parameter for the page number
csvFile | Optional Parameter for geting filtered data in CSV format ('yes' for geting the file)
sortOn | Optional Parameter for sorting on the field of tweet. Example: created_at, retweet_count, etc
orderSort | Optional Parameter for sorting. '1' for sorting in ascending order and '-1' for sorting in descending order
