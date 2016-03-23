
/////////////////////////////////////////////////////////////////////////////////////////////
///////////// MongoLab Setup as well as a store on mongo to collect session data/////////////
////////////////////////////////////////////////////////////////////////////////////////////
var MongoClient = require('mongodb').MongoClient;
var configURI = 'mongodb://cpcc-coder:cpccs3cr3t@ds011389.mlab.com:11389/blockchain';
var myDB = '';

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////// Configure APIs to query MongoLab datastore and to insert records/////////////
////////////////////////////////////////////////////////////////////////////////////////////

exports.find = function(city, cb) {

    console.log("entered exports.find");
    MongoClient.connect(configURI, function(err,db) {
      if (err) {
          console.log("error opening MongoDB");
          cb(err);}
        else {
          console.log("MongoDB Connected");

          myDB = db.db("blockchain");
          var collection = myDB.collection('pat');
          var cityObj = {'city': city};

          collection.find(cityObj).toArray(function(err, docs) {
              console.log("Found the following records");
              console.dir(docs);
              cb(null, docs);
            });
          }
        })
      };
