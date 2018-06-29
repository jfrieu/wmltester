const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
// app.use(bodyParser.json())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/', function(req, res) {
	const htmlfile = __dirname + '/public/index.html';
	console.log("Server.js Serving htmlfile : " + htmlfile);
    res.sendFile(path.join(htmlfile));
});

app.use('/images', express.static(__dirname + '/images'));

// Require api routes
require('./app/routes/scoreapi.routes.js')(app);


// listen for requests
var port = process.env.PORT;
if (port === undefined || port === null) {
     var port = 3000; // Needed to test locally
}

app.listen(port, () => {
  console.log("Server.js - Server starting on port : " + port );
}
);

