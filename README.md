# Watson Machine Learning Scoring Demo

## Overview

This is a simple application that shows you how to call the scoring endpoint for a deployed model in the Watson Machine Learning service.

## Installing

## Configure 


Edit config/ml.config.js 

The file should look similar to the following:

```
	WML_USERNAME : "3f027710-3905-4f25-9be8-4cc5f2ddcaec",
    WML_PASSWORD : "772a0ac9-2766-4968-b47a-3335acc5d7ee",
	WML_SERVICE_PATH : 'https://ibm-watson-ml.mybluemix.net',
	WML_INSTANCE_ID:"7f2d88d2-84f4-4136-ad1c-8318051c8263",
	WML_MODEL_ID:"f2681482-07b3-4aa9-ac46-ffcf5b42831b",
	WML_DEPLOYMENT_ID:"cb6d7e1c-b3b5-4954-803e-2712c0438681"
```

2. Fill in `WML_USERNAME`, `WML_PASSWORD`, and `WML_INSTANCE_ID`:
  - Go to your IBM Watson Machine Learning service in your IBM Cloud instance
  - Click _Service Credentials_
  - Expand your credentials
  - Copy and paste the username, password, and instance_id values


3. Fill in `WML_MODEL_ID` and `WML_DEPLOYMENT_ID`:
  - Click your model under _Models_ in the _Assets_ tab in your Data Science Platform or Watson Data Platform account
  - Click the _Deployments_ tab
  - Click the deployment
  - Copy and paste the Deployment ID to WML_DEPLOYMENT_ID and Model ID to WML_MODEL_ID values
  
  

## Run Locally

Get all dependencies required from the package.json
npm install

run 
node server.js

Access URL localhost:3000
  
  
## Run in IBM Cloud

Edit manifest.yml and change name, host and services definitions to suit your environment

```
applications:
- path: .
  buildpack: sdk-for-nodejs
  no-route: false
  memory: 128M
  instances: 1
  domain: mybluemix.net
  name: datadealerswmltester
  host: datadealerswmltester
disk_quota: 256M
services:
 - WMLDataDealers
```


![Watson ML Model Deployment](https://raw.githubusercontent.com/ibm-watson-data-lab/watson-ml-scoring-util-nodejs/master/readme/img/watson-ml-model-deployment.png)