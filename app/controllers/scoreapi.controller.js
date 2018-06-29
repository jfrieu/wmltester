const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const btoa = require("btoa");
const wml_credentials = new Map();
const wml_endpoint = new Map();

//  Fill in your configuration in the ml.config.js in config folder
const mlconfig = require('../../config/ml.config.js');

const wml_service_credentials_url = mlconfig.WML_SERVICE_PATH;
const wml_service_credentials_username = mlconfig.WML_USERNAME;
const wml_service_credentials_password = mlconfig.WML_PASSWORD;

wml_credentials.set("url", wml_service_credentials_url);
wml_credentials.set("username", wml_service_credentials_username);
wml_credentials.set("password", wml_service_credentials_password);

const wml_service_instance_id = mlconfig.WML_INSTANCE_ID;
const wml_service_model_id 	  = mlconfig.WML_MODEL_ID;
const wml_service_deployment_id = mlconfig.WML_DEPLOYMENT_ID;

wml_endpoint.set("instance_id", wml_service_instance_id);
wml_endpoint.set("model_id", wml_service_model_id);
wml_endpoint.set("deployment_id", wml_service_deployment_id);


// const wml_scoring_url=mlconfig.scoring_url;



console.log("Scoreapi.controller.js - wml credentials " + wml_credentials.url);

function apiGet(url, username, password, err, callback){
    console.log("ScoreApiController.js Getting Token for API request..") 
    const oReq = new XMLHttpRequest();
    const tokenHeader = "Basic " + btoa((username + ":" + password));
    const tokenUrl = url + "/v3/identity/token";
    oReq.open("GET", tokenUrl, false);
    oReq.setRequestHeader("Authorization", tokenHeader);
    oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    oReq.onreadystatechange = function() {//Call a function when the state changes.
        if (oReq.readyState == 4) {  
            if (oReq.status == 200) {
            console.log("ScoreApiController.js Readystate is 4. Got a valid token");
	        // console.log(oReq.readyState);
	        // console.log(oReq.status);
	        var parsedGetResponse = JSON.parse(oReq.responseText);
                const token = parsedGetResponse.token;
                return callback(token);
             } else {
            console.log("ScoreApiController.js Ready state is  4. But status is not 200, but " + oReq.status);
	        // console.log(oReq.readyState);
	        // console.log(oReq.status);
	        parsedGetResponse = JSON.parse(oReq.responseText);
                return err(parsedGetResponse);
             }
	}    
   }

   // Send the Token Request and Wait
   oReq.send();
}

function apiPost(scoring_url, token, payload, err, callback){
        
        console.log("ScoreApiController.js Sending the Scoring Request.. ") ;
        console.log("ScoreApiController.js ... to URL " + scoring_url);

	const oReq = new XMLHttpRequest();
        console.log("ScoreApiController.js Async Scoring request to WML opened");

        oReq.open("POST", scoring_url, true);

        //Send the proper header information along with the request
	oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	oReq.setRequestHeader("Authorization", token);

        oReq.onreadystatechange = function() {//Call a function when the state changes.
	    if (oReq.readyState == 4) {
	        if (oReq.status == 200) {
       	            console.log("ScoreApiController.js Readystate is 4. Got a valid Scoring response");
                //    console.log(oReq.readyState);
                //    console.log(oReq.status);
				console.log("ScoreApiController.js response " + oReq.responseText);
	            return callback(oReq.responseText);
	         } else {
                    console.log("ScoreApiController.js Ready state is 4.  But didnt get a valid scoring response. Error code below");
                    // console.log(oReq.readyState);
                    // console.log(oReq.status);
                    return err(oReq.responseText);
                 }
	     }   
        }	
        
	// Send the scoring request and wait
	oReq.send(payload);
}



 // Get the auth token and score 
 exports.create = (req, res) => {
     console.log("ScoreApiController.js Start processing the score request.. REQ : " + JSON.stringify(req.body)); 
	 
     apiGet(wml_credentials.get("url"), 
            wml_credentials.get("username"),
			wml_credentials.get("password"), 
	    function(errmsg) {
	        console.log("ScoreApiController.js Error getting token");
	        res.json(errmsg);
	    }, 
	    function(token) {
                console.log("ScoreApiController.js Got a valid token");
                const wmlToken = "Bearer " + token;
				// console.log(wmlToken);
                
				const payload = JSON.stringify(req.body);
				// const scoring_url=wml_scoring_url;
				const scoring_url = `${wml_credentials.get("url")}/v3/wml_instances/${wml_endpoint.get("instance_id")}/model_id/${wml_endpoint.get("model_id")}/deployment_id/${wml_endpoint.get("deployment_id")}/online`	

                apiPost(scoring_url, 
		        wmlToken, 
				payload, 
			function(err) {
       	                   // console.log("Error scoring call back function called");
                           console.log(err);
                           res.json(err);
	                }, 
			function(result) {
                           // console.log("Scoring call back function called");
                           // console.log(result);
                           //res.json(result);
                           res.send(result);
             	        });
            });
};
