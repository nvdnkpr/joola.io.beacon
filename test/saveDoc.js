var 
  http = require('http');

var data = {};

data.id = 123;
data.message = 'test';


var dataString = JSON.stringify(data);

var headers = {
  'Content-Type': 'application/json',
  'Content-Length': dataString.length
};

var options = {
  host: 'localhost',
  port: 40005,
  path: '/save',
  method: 'POST',
  headers: headers
};


// Setup the request.  The options parameter is
// the object we defined above.
var req = http.request(options, function(res) {
  res.setEncoding('utf-8');

  var responseString = '';

  res.on('data', function(data) {
    responseString += data;
  });

  res.on('end', function() {
    console.log(responseString);
    //var resultObject = JSON.parse(responseString);
  });
});

req.on('error', function(e) {
  // TODO: handle error.
});

req.write(dataString);
req.end();