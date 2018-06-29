
module.exports = (app) => {
	console.log("Scoreapi.route.js defining route and associated controller" );
    const scoreapi = require('../controllers/scoreapi.controller.js');

    // Call the Watson ML score API 
	console.log("Scoreapi.route.js handling route /score used by html client" );
    app.post('/score', scoreapi.create);

}

