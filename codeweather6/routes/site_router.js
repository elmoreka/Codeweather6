
var express = require('express');
var router = express.Router();
var fs = require("fs");
var request = require('request');
var url = require('url');
var api = require('../config')

var userCount = 0;


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
////////////////////////// Yahoo Weather Forecast - URL Elements////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

var cityUrlObj = {
	hostURL: 'https://query.yahooapis.com/',
	pathURL: 'v1/public/yql',
	qURL:    '?q=select%20*%20from%20weather.forecast%20where%20woeid%3D',
	cityCode: '12769483',
	tagURL:   '&format=json&diagnostics=true&callback='
};

var cityUrlArr = [];

var charlotteURL = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D12769483&format=json&diagnostics=true&callback=';
var moscowURL = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D2122265&format=json&diagnostics=true&callback=';
var data = {};
var walmartData = {};
var walmartDefault = {
	name: "no store available near this city",
	streetAddress: " ",
	city: " ",
	stateProvCode: " ",
	phoneNumber: " "};
var reqURL = ' ';

/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////              HOME                 ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
router.route("/").get(function(req, res){
	req.baq = {};
	console.log("Bad Request - Need City", req.url);
	req.bag.errcde = 400;
	req.bag.errmsg = "Sorry, Bad Request. Please designate a city";
	res.render('template/badrequest', {bag:req.bag});

});

/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////       City Weather Forecast       ///////////////////////////////
///////////////////////    API = domain.com/city?name=xxx    ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
router.route("/city").get(function(req, res){
	userCount = userCount + 1;
	console.log("display req " + req.url);
	var cityName = req.param('name');
	var cityCode;



//mongo api to fetch the code for the city
	api.find(cityName, function(err, cityCode){			

				// dynamically build the walmart api and fetch stores
				createWalmartAPI(cityName, function(err, reqURL) {
					    request(reqURL, function(err, response, body ) {
					        if (!err && response.statusCode === 200) {
					          walmartData = JSON.parse( body );
										if (walmartData.length > 0) {
					          	console.log("walmart object = " + JSON.stringify(walmartData[0]));
											} else {
												walmartData = [];
												walmartData[0] = walmartDefault;
											};

										// dynamically build the yahoo api and fetch forecast
										createUrl(cityCode[0].code, function(err, reqURL){
													request(reqURL, function(err, response, body ) {
    													if (!err && response.statusCode === 200) {
      													data = JSON.parse( body );

																// render to browser
      													res.render('index', {Visitors: userCount,
                           														Date: data.query.results.channel.item.forecast[0].date,
													 														City: data.query.results.channel.location.city,
                           														Day: data.query.results.channel.item.forecast[0].day,
                           														High: data.query.results.channel.item.forecast[0].high,
                           														Low: data.query.results.channel.item.forecast[0].low,
                           														Conditions: data.query.results.channel.item.forecast[0].text,
																											Name: walmartData[0].name,
																											StreetAddress: walmartData[0].streetAddress,
																											CityAddress: walmartData[0].city,
																											StateAddress: walmartData[0].stateProvCode,
																											PhoneNumber: walmartData[0].phoneNumber});
      						 	}
  						 		})
						 		})
							}
						});
					});
			});
		});



/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////      function to assemble the Walmart API///////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function createWalmartAPI(cityName, cb){
	walmartObj.cityName = cityName;
	walmartArr = [];
	walmartArr.push(walmartObj.hostURL);
	walmartArr.push(walmartObj.pathURL);
	walmartArr.push(walmartObj.apiKey);
	walmartArr.push(walmartObj.qURL);
	walmartArr.push(walmartObj.cityName);
	walmartArr.push(walmartObj.tagURL);
	reqURL = walmartArr.join("");

	console.log("cityName = " + cityName);
	console.log("new url = " + reqURL);
	cb(null, reqURL);
};

/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////      function to assemble Yahoo API   ///////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function createUrl(cityCode, cb){
		cityUrlObj.cityCode = cityCode;
		cityUrlArr = [];
		cityUrlArr.push(cityUrlObj.hostURL);
		cityUrlArr.push(cityUrlObj.pathURL);
		cityUrlArr.push(cityUrlObj.qURL);
		cityUrlArr.push(cityUrlObj.cityCode);
		cityUrlArr.push(cityUrlObj.tagURL);
		reqURL = cityUrlArr.join("");

		console.log("cityCode = " + cityCode);
		console.log("new url = " + reqURL);
		cb(null, reqURL);
	};

module.exports = router;
