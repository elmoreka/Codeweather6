// CPCC REACH IT - APIs and EXPRESS
// Class Exercise - Stub to be completed for dynamically assembling the WalMartAPI
var express = require('express');
var app = express();
var router = express.Router();
var request = require('request');
var url = require('url');
var port = process.env.PORT || 3000;


/////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// Walmart API - URL Elements////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

var walmartObj = {
	hostURL: 'http://api.walmartlabs.com/',
	pathURL: 'v1/stores',
	apiKey: '?apiKey=sgppjctyv87z5vekuywkpz5e',
	qURL:    '&city=',
	cityName: 'charlotte',
	tagURL:   '&format=json'
};

var walmartlArr = [];


/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////// Walmart Store Location Based on City Forecast  //////////////////////////
///////////////////////    API = domain.com/city?name=xxx    ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
app.get("/city", function(req, res){

	console.log("display req " + req.url);
	var cityName = req.param('name');
	var cityCode;

  createWalmartAPI(cityName, function(err, reqURL) {
        request(reqURL, function(err, response, body ) {
            if (!err && response.statusCode === 200) {
              data = JSON.parse( body );
              res.send(data);
        }
      });
    });
  });


// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);


/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////      function to assemble the Walmart API///////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function createWalmartAPI(cityName, cb){
	walmartObj.cityName = cityName;
	console.log("UPDATE THIS FUNCTION TO DYNAMICALLY ASSEMBLE A WALMART API")

	console.log("cityName = " + cityName);
	console.log("new url = " + reqURL);
	cb(null, reqURL);
	};
